(function () {
  var defaultSteps = [
    {
      id: 'plan',
      name: 'Plan task',
      description: 'Agent creates an implementation plan and inspects relevant files.',
      credits: 700,
    },
    {
      id: 'inspect',
      name: 'Repository context',
      description: 'Agent loads context, dependencies, tests, and related code paths.',
      credits: 950,
    },
    {
      id: 'implement',
      name: 'Implementation loop',
      description: 'Agent edits multiple files and iterates on the implementation.',
      credits: 1600,
    },
    {
      id: 'test',
      name: 'Test and fix loop',
      description: 'Agent runs tests, reads failures, and applies corrections.',
      credits: 1250,
    },
    {
      id: 'review',
      name: 'Review and PR summary',
      description: 'Agent summarises changes, risks, and follow-up actions.',
      credits: 650,
    },
  ];

  var presets = {
    normal: {
      label: 'Normal dev request',
      description: 'Small request that stays inside ULB and consumes the shared pool.',
      userType: 'standard',
      singleRequest: 1200,
      poolRemaining: 390000,
      userUsed: 0,
      costCenterMeteredRemaining: 200000,
      enterpriseMeteredRemaining: 1000000,
    },
    spike: {
      label: 'Power user spike',
      description: 'Single request exceeds the universal user-level budget.',
      userType: 'standard',
      singleRequest: 4000,
      poolRemaining: 390000,
      userUsed: 0,
      costCenterMeteredRemaining: 200000,
      enterpriseMeteredRemaining: 1000000,
    },
    architect: {
      label: 'Architect override',
      description: 'Named user has an individual budget override above the ULB.',
      userType: 'architect',
      singleRequest: 6000,
      poolRemaining: 390000,
      userUsed: 0,
      costCenterMeteredRemaining: 200000,
      enterpriseMeteredRemaining: 1000000,
    },
    poolLow: {
      label: 'Pool exhaustion',
      description: 'The shared pool runs out mid-flow and metered mode begins.',
      userType: 'architect',
      singleRequest: 4000,
      poolRemaining: 2000,
      userUsed: 0,
      costCenterMeteredRemaining: 200000,
      enterpriseMeteredRemaining: 1000000,
    },
    ccBlock: {
      label: 'Cost centre block',
      description: 'Pool is empty and the cost centre does not have enough metered budget.',
      userType: 'architect',
      singleRequest: 6000,
      poolRemaining: 0,
      userUsed: 0,
      costCenterMeteredRemaining: 3000,
      enterpriseMeteredRemaining: 1000000,
    },
    enterpriseBlock: {
      label: 'Enterprise hard stop',
      description: 'Pool is empty, cost centre is fine, but the enterprise cap is exhausted.',
      userType: 'architect',
      singleRequest: 6000,
      poolRemaining: 0,
      userUsed: 0,
      costCenterMeteredRemaining: 200000,
      enterpriseMeteredRemaining: 3000,
    },
  };

  function toNumber(value, fallback) {
    var next = Number(value);
    if (Number.isNaN(next)) {
      return fallback;
    }
    return Math.max(0, Math.round(next));
  }

  function formatCredits(value) {
    return new Intl.NumberFormat('en-GB').format(Math.max(0, Math.round(value)));
  }

  function formatMoney(credits) {
    return (credits * 0.01).toLocaleString('en-GB', { maximumFractionDigits: 2 });
  }

  var state = {
    universalLimit: 2500,
    individualLimit: 8000,
    userType: 'standard',
    singleRequest: 2000,
    userUsed: 0,
    poolRemaining: 390000,
    costCenterMeteredRemaining: 200000,
    enterpriseMeteredRemaining: 1000000,
    mode: 'single',
    steps: defaultSteps.map(function (step) { return Object.assign({}, step); }),
    logs: [],
    nodeStates: {},
  };

  var elements = {};
  var initialized = false;

  function getActiveUserLimit() {
    return state.userType === 'architect' ? state.individualLimit : state.universalLimit;
  }

  function getTotalAgenticCredits() {
    return state.steps.reduce(function (sum, step) {
      return sum + toNumber(step.credits, 0);
    }, 0);
  }

  function evaluateStep(args) {
    var label = args.label;
    var credits = toNumber(args.credits, 0);
    var current = args.current;
    var nextLogs = [];
    var nextNodeStates = {
      user: 'idle',
      pool: 'idle',
      paid: 'idle',
      costCentre: 'idle',
      enterprise: 'idle',
      result: 'idle',
    };

    var activeUserLimit = getActiveUserLimit();
    var limitLabel = state.userType === 'architect' ? 'Individual override' : 'Universal user-level budget';

    if (current.userUsed + credits > activeUserLimit) {
      nextNodeStates.user = 'block';
      nextNodeStates.result = 'block';
      nextLogs.push('BLOCK ' + label + ': ' + limitLabel + ' exceeded (' + formatCredits(current.userUsed + credits) + ' / ' + formatCredits(activeUserLimit) + ' credits).');
      return { blocked: true, logs: nextLogs, nodeStates: nextNodeStates, current: current };
    }

    nextNodeStates.user = 'pass';
    nextLogs.push('PASS ' + label + ': user-level control passed (' + formatCredits(current.userUsed + credits) + ' / ' + formatCredits(activeUserLimit) + ' credits).');

    if (current.poolRemaining >= credits) {
      nextNodeStates.pool = 'pass';
      nextNodeStates.result = 'pass';

      return {
        blocked: false,
        logs: nextLogs.concat('PASS ' + label + ': consumed ' + formatCredits(credits) + ' credits from the shared pool.'),
        nodeStates: nextNodeStates,
        current: {
          userUsed: current.userUsed + credits,
          poolRemaining: current.poolRemaining - credits,
          costCenterMeteredRemaining: current.costCenterMeteredRemaining,
          enterpriseMeteredRemaining: current.enterpriseMeteredRemaining,
        },
      };
    }

    var poolPart = Math.max(0, current.poolRemaining);
    var paidPart = credits - poolPart;

    nextNodeStates.pool = poolPart > 0 ? 'warn' : 'block';
    nextNodeStates.paid = 'warn';

    nextLogs.push('WARN ' + label + ': pool covers ' + formatCredits(poolPart) + '; ' + formatCredits(paidPart) + ' credits move to metered mode.');

    if (current.costCenterMeteredRemaining < paidPart) {
      nextNodeStates.costCentre = 'block';
      nextNodeStates.result = 'block';
      nextLogs.push('BLOCK ' + label + ': cost centre requires ' + formatCredits(paidPart) + ', remaining ' + formatCredits(current.costCenterMeteredRemaining) + '.');
      return { blocked: true, logs: nextLogs, nodeStates: nextNodeStates, current: current };
    }

    nextNodeStates.costCentre = 'pass';

    if (current.enterpriseMeteredRemaining < paidPart) {
      nextNodeStates.enterprise = 'block';
      nextNodeStates.result = 'block';
      nextLogs.push('BLOCK ' + label + ': enterprise metered cap requires ' + formatCredits(paidPart) + ', remaining ' + formatCredits(current.enterpriseMeteredRemaining) + '.');
      return { blocked: true, logs: nextLogs, nodeStates: nextNodeStates, current: current };
    }

    nextNodeStates.enterprise = 'pass';
    nextNodeStates.result = 'warn';

    nextLogs.push('PASS ' + label + ': metered usage allowed for ' + formatCredits(paidPart) + ' credits (' + formatMoney(paidPart) + ').');

    return {
      blocked: false,
      logs: nextLogs,
      nodeStates: nextNodeStates,
      current: {
        userUsed: current.userUsed + credits,
        poolRemaining: 0,
        costCenterMeteredRemaining: current.costCenterMeteredRemaining - paidPart,
        enterpriseMeteredRemaining: current.enterpriseMeteredRemaining - paidPart,
      },
    };
  }

  function setMode(mode) {
    state.mode = mode;
    elements.singlePanel.classList.toggle('d-none', mode !== 'single');
    elements.agenticPanel.classList.toggle('d-none', mode !== 'agentic');

    elements.modeSingle.classList.toggle('active', mode === 'single');
    elements.modeSingle.setAttribute('aria-selected', mode === 'single' ? 'true' : 'false');
    elements.modeAgentic.classList.toggle('active', mode === 'agentic');
    elements.modeAgentic.setAttribute('aria-selected', mode === 'agentic' ? 'true' : 'false');
  }

  function setUserType(type) {
    state.userType = type;
    elements.userStandard.classList.toggle('btn-primary', type === 'standard');
    elements.userStandard.classList.toggle('btn-outline-primary', type !== 'standard');
    elements.userArchitect.classList.toggle('btn-primary', type === 'architect');
    elements.userArchitect.classList.toggle('btn-outline-primary', type !== 'architect');
    renderFlowDetails();
  }

  function applyPreset(key) {
    var preset = presets[key];
    if (!preset) {
      return;
    }
    state.userType = preset.userType;
    state.singleRequest = preset.singleRequest;
    state.poolRemaining = preset.poolRemaining;
    state.userUsed = preset.userUsed;
    state.costCenterMeteredRemaining = preset.costCenterMeteredRemaining;
    state.enterpriseMeteredRemaining = preset.enterpriseMeteredRemaining;
    state.logs = ['Preset loaded: ' + preset.label, preset.description];
    state.nodeStates = {};
    syncInputs();
    renderAll();
  }

  function resetSystem() {
    state.universalLimit = 2500;
    state.individualLimit = 8000;
    state.userType = 'standard';
    state.singleRequest = 2000;
    state.userUsed = 0;
    state.poolRemaining = 390000;
    state.costCenterMeteredRemaining = 200000;
    state.enterpriseMeteredRemaining = 1000000;
    state.mode = 'single';
    state.steps = defaultSteps.map(function (step) { return Object.assign({}, step); });
    state.logs = [];
    state.nodeStates = {};
    syncInputs();
    renderAll();
  }

  function runSingle() {
    var result = evaluateStep({
      label: 'Single request',
      credits: state.singleRequest,
      current: {
        userUsed: state.userUsed,
        poolRemaining: state.poolRemaining,
        costCenterMeteredRemaining: state.costCenterMeteredRemaining,
        enterpriseMeteredRemaining: state.enterpriseMeteredRemaining,
      },
    });

    state.userUsed = result.current.userUsed;
    state.poolRemaining = result.current.poolRemaining;
    state.costCenterMeteredRemaining = result.current.costCenterMeteredRemaining;
    state.enterpriseMeteredRemaining = result.current.enterpriseMeteredRemaining;
    state.logs = result.logs;
    state.nodeStates = result.nodeStates;
    renderAll();
  }

  function runAgentic() {
    var working = {
      userUsed: state.userUsed,
      poolRemaining: state.poolRemaining,
      costCenterMeteredRemaining: state.costCenterMeteredRemaining,
      enterpriseMeteredRemaining: state.enterpriseMeteredRemaining,
    };
    var allLogs = [
      'Agentic workflow started - ' + state.steps.length + ' steps, ' + formatCredits(getTotalAgenticCredits()) + ' planned credits.'
    ];
    var lastNodeStates = {};

    for (var i = 0; i < state.steps.length; i += 1) {
      var step = state.steps[i];
      var result = evaluateStep({
        label: step.name,
        credits: step.credits,
        current: working,
      });

      allLogs = allLogs.concat(result.logs);
      lastNodeStates = result.nodeStates;
      working = result.current;

      if (result.blocked) {
        allLogs.push('Stopped at step: ' + step.name);
        break;
      }
    }

    state.userUsed = working.userUsed;
    state.poolRemaining = working.poolRemaining;
    state.costCenterMeteredRemaining = working.costCenterMeteredRemaining;
    state.enterpriseMeteredRemaining = working.enterpriseMeteredRemaining;
    state.logs = allLogs;
    state.nodeStates = lastNodeStates;
    renderAll();
  }

  function updateStepCredits(id, value) {
    var parsed = toNumber(value, 0);
    state.steps = state.steps.map(function (step) {
      if (step.id !== id) {
        return step;
      }
      return Object.assign({}, step, { credits: parsed });
    });
    renderAgentic();
  }

  function setNodeState(element, nodeState) {
    element.classList.remove('is-idle', 'is-pass', 'is-warn', 'is-block');
    element.classList.add('is-' + (nodeState || 'idle'));
  }

  function renderPresets() {
    elements.presets.innerHTML = '';
    Object.keys(presets).forEach(function (key) {
      var preset = presets[key];
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'ubb-preset-btn';
      button.addEventListener('click', function () { applyPreset(key); });

      var title = document.createElement('div');
      title.className = 'ubb-preset-title';
      title.textContent = preset.label;

      var description = document.createElement('div');
      description.className = 'ubb-preset-description';
      description.textContent = preset.description;

      button.appendChild(title);
      button.appendChild(description);
      elements.presets.appendChild(button);
    });
  }

  function renderAgentic() {
    var total = getTotalAgenticCredits();
    elements.agenticSummary.textContent = 'Planned workflow: ' + formatCredits(total) + ' credits across ' + state.steps.length + ' steps.';

    elements.steps.innerHTML = '';
    state.steps.forEach(function (step, index) {
      var row = document.createElement('div');
      row.className = 'ubb-step-row';

      var left = document.createElement('div');
      var title = document.createElement('div');
      title.className = 'ubb-step-title';
      title.textContent = (index + 1) + '. ' + step.name;
      var description = document.createElement('div');
      description.className = 'ubb-step-description';
      description.textContent = step.description;
      left.appendChild(title);
      left.appendChild(description);

      var right = document.createElement('div');
      var label = document.createElement('label');
      label.className = 'form-label fw-semibold mb-1';
      label.textContent = 'Credits';
      label.setAttribute('for', 'ubb-step-' + step.id);
      var input = document.createElement('input');
      input.className = 'form-control form-control-sm';
      input.type = 'number';
      input.id = 'ubb-step-' + step.id;
      input.min = '0';
      input.step = '50';
      input.value = String(step.credits);
      input.addEventListener('input', function (event) {
        updateStepCredits(step.id, event.target.value);
      });
      right.appendChild(label);
      right.appendChild(input);

      row.appendChild(left);
      row.appendChild(right);
      elements.steps.appendChild(row);
    });
  }

  function renderFlowDetails() {
    if (state.userType === 'architect') {
      elements.nodeUserDetail.textContent = 'Individual override: ' + formatCredits(state.individualLimit);
    } else {
      elements.nodeUserDetail.textContent = 'ULB: ' + formatCredits(state.universalLimit);
    }
    elements.nodePoolDetail.textContent = formatCredits(state.poolRemaining) + ' credits remaining';
    elements.nodeCostCentreDetail.textContent = formatCredits(state.costCenterMeteredRemaining) + ' metered credits left';
    elements.nodeEnterpriseDetail.textContent = formatCredits(state.enterpriseMeteredRemaining) + ' metered credits left';
  }

  function renderFlowNodes() {
    var nodes = state.nodeStates || {};
    setNodeState(elements.nodeUser, nodes.user);
    setNodeState(elements.nodePool, nodes.pool);
    setNodeState(elements.nodePaid, nodes.paid);
    setNodeState(elements.nodeCostCentre, nodes.costCentre);
    setNodeState(elements.nodeEnterprise, nodes.enterprise);
    setNodeState(elements.nodeResult, nodes.result);

    if (nodes.result === 'block') {
      elements.nodeResultDetail.textContent = 'Request blocked';
    } else if (nodes.result === 'warn') {
      elements.nodeResultDetail.textContent = 'Paid usage allowed';
    } else if (nodes.result === 'pass') {
      elements.nodeResultDetail.textContent = 'Free pool usage';
    } else {
      elements.nodeResultDetail.textContent = 'Run a scenario.';
    }
  }

  function renderSummary() {
    elements.statUserUsed.textContent = formatCredits(state.userUsed);
    elements.statPool.textContent = formatCredits(state.poolRemaining);
    elements.statCostCentre.textContent = formatCredits(state.costCenterMeteredRemaining);
    elements.statEnterprise.textContent = formatCredits(state.enterpriseMeteredRemaining);
  }

  function renderLogs() {
    if (!state.logs.length) {
      elements.log.textContent = 'Run a scenario to see the decision trail.';
      return;
    }

    elements.log.innerHTML = '';
    state.logs.forEach(function (entry) {
      var line = document.createElement('div');
      line.className = 'ubb-log-line';
      line.textContent = entry;
      elements.log.appendChild(line);
    });
  }

  function syncInputs() {
    elements.universalLimit.value = String(state.universalLimit);
    elements.individualLimit.value = String(state.individualLimit);
    elements.singleRequest.value = String(state.singleRequest);
    elements.poolRemaining.value = String(state.poolRemaining);
    elements.costCentreRemaining.value = String(state.costCenterMeteredRemaining);
    elements.enterpriseRemaining.value = String(state.enterpriseMeteredRemaining);
    setUserType(state.userType);
    setMode(state.mode);
  }

  function renderAll() {
    syncInputs();
    renderSummary();
    renderFlowDetails();
    renderFlowNodes();
    renderLogs();
    renderAgentic();
  }

  function attachInputHandlers() {
    elements.universalLimit.addEventListener('input', function (event) {
      state.universalLimit = toNumber(event.target.value, state.universalLimit);
      renderFlowDetails();
    });

    elements.individualLimit.addEventListener('input', function (event) {
      state.individualLimit = toNumber(event.target.value, state.individualLimit);
      renderFlowDetails();
    });

    elements.singleRequest.addEventListener('input', function (event) {
      state.singleRequest = toNumber(event.target.value, state.singleRequest);
    });

    elements.poolRemaining.addEventListener('input', function (event) {
      state.poolRemaining = toNumber(event.target.value, state.poolRemaining);
      renderSummary();
      renderFlowDetails();
    });

    elements.costCentreRemaining.addEventListener('input', function (event) {
      state.costCenterMeteredRemaining = toNumber(event.target.value, state.costCenterMeteredRemaining);
      renderSummary();
      renderFlowDetails();
    });

    elements.enterpriseRemaining.addEventListener('input', function (event) {
      state.enterpriseMeteredRemaining = toNumber(event.target.value, state.enterpriseMeteredRemaining);
      renderSummary();
      renderFlowDetails();
    });
  }

  function init() {
    if (initialized) {
      return;
    }

    var root = document.querySelector('.ubb-page');
    if (!root) {
      return;
    }

    initialized = true;

    elements = {
      statUserUsed: document.getElementById('ubb-stat-user-used'),
      statPool: document.getElementById('ubb-stat-pool'),
      statCostCentre: document.getElementById('ubb-stat-cost-centre'),
      statEnterprise: document.getElementById('ubb-stat-enterprise'),

      userStandard: document.getElementById('ubb-user-standard'),
      userArchitect: document.getElementById('ubb-user-architect'),

      universalLimit: document.getElementById('ubb-universal-limit'),
      individualLimit: document.getElementById('ubb-individual-limit'),
      singleRequest: document.getElementById('ubb-single-request'),
      poolRemaining: document.getElementById('ubb-pool-remaining'),
      costCentreRemaining: document.getElementById('ubb-cost-centre-remaining'),
      enterpriseRemaining: document.getElementById('ubb-enterprise-remaining'),

      modeSingle: document.getElementById('ubb-mode-single'),
      modeAgentic: document.getElementById('ubb-mode-agentic'),
      singlePanel: document.getElementById('ubb-single-panel'),
      agenticPanel: document.getElementById('ubb-agentic-panel'),
      agenticSummary: document.getElementById('ubb-agentic-summary'),
      steps: document.getElementById('ubb-steps'),

      nodeUser: document.getElementById('ubb-node-user'),
      nodeUserDetail: document.getElementById('ubb-node-user-detail'),
      nodePool: document.getElementById('ubb-node-pool'),
      nodePoolDetail: document.getElementById('ubb-node-pool-detail'),
      nodePaid: document.getElementById('ubb-node-paid'),
      nodeCostCentre: document.getElementById('ubb-node-cost-centre'),
      nodeCostCentreDetail: document.getElementById('ubb-node-cost-centre-detail'),
      nodeEnterprise: document.getElementById('ubb-node-enterprise'),
      nodeEnterpriseDetail: document.getElementById('ubb-node-enterprise-detail'),
      nodeResult: document.getElementById('ubb-node-result'),
      nodeResultDetail: document.getElementById('ubb-node-result-detail'),

      log: document.getElementById('ubb-log'),
      presets: document.getElementById('ubb-presets'),

      reset: document.getElementById('ubb-reset'),
      run: document.getElementById('ubb-run'),
    };

    renderPresets();
    attachInputHandlers();

    elements.userStandard.addEventListener('click', function () { setUserType('standard'); });
    elements.userArchitect.addEventListener('click', function () { setUserType('architect'); });
    elements.modeSingle.addEventListener('click', function () { setMode('single'); });
    elements.modeAgentic.addEventListener('click', function () { setMode('agentic'); });
    elements.reset.addEventListener('click', resetSystem);
    elements.run.addEventListener('click', function () {
      if (state.mode === 'single') {
        runSingle();
      } else {
        runAgentic();
      }
    });

    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
