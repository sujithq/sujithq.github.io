import argparse
import base64
import os
import urllib.request

from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import AzureOpenAI


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--prompt", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--endpoint", required=True)
    parser.add_argument("--model", required=True)
    parser.add_argument("--size", default="1024x1024")
    parser.add_argument("--quality", default="medium")
    parser.add_argument("--style")
    return parser.parse_args()


def create_client(endpoint):
    token_provider = get_bearer_token_provider(
        DefaultAzureCredential(),
        "https://cognitiveservices.azure.com/.default",
    )

    return AzureOpenAI(
        api_version="2024-02-01",
        azure_endpoint=endpoint,
        azure_ad_token_provider=token_provider,
    )


def save_image(output_path, image_data):
    if getattr(image_data, "b64_json", None):
        with open(output_path, "wb") as output_file:
            output_file.write(base64.b64decode(image_data.b64_json))
        return

    if getattr(image_data, "url", None):
        with urllib.request.urlopen(image_data.url) as response:
            with open(output_path, "wb") as output_file:
                output_file.write(response.read())
        return

    raise ValueError("Image response did not include b64_json or url data.")


def main():
    args = parse_args()
    os.makedirs(os.path.dirname(os.path.abspath(args.output)) or ".", exist_ok=True)

    client = create_client(args.endpoint)
    generate_kwargs = {
        "model": args.model,
        "prompt": args.prompt,
        "size": args.size,
        "quality": args.quality,
        "n": 1,
    }
    if args.style:
        generate_kwargs["style"] = args.style

    result = client.images.generate(
        **generate_kwargs,
    )

    save_image(args.output, result.data[0])
    print(f"Image generated for prompt: {args.prompt}")


if __name__ == "__main__":
    main()
