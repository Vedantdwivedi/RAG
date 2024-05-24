<p align="center"><img alt="Logo - RAGapp" src="docs/logo.png"></p>

<p align="center"><strong>The easiest way to use Agentic RAG in any enterprise.</strong></p>

<p align="center">As simple to configure as <a href="https://openai.com/index/introducing-gpts" target="_blank">OpenAI's custom GPTs</a>, but deployable in your own cloud infrastructure using Docker. Built using <a href="https://github.com/run-llama/llama_index">LlamaIndex</a>.</p>

<p align="center">
  <a href="#get-started"><strong>Get Started</strong></a> ·
  <a href="#endpoints"><strong>Endpoints</strong></a> ·
  <a href="#deployment"><strong>Deployment</strong></a> ·
  <a href="#contact"><strong>Contact</strong></a> 
</p>

<br/>
<img alt="Screenshot" src="docs/screenshot.png">

## Get Started

To run, start a docker container with our image:

```shell
docker run -p 8000:8000 ragapp/ragapp
```

Then, access the Admin UI at http://localhost:8000/admin to configure your RAGapp.

You can use hosted AI models from OpenAI or Gemini, and local models using [Ollama](https://ollama.com/).

## Endpoints

The docker container exposes the following endpoints:

- Admin UI: http://localhost:8000/admin
- Chat UI: http://localhost:8000
- API: http://localhost:8000/docs

> _Note_: The Chat UI and API are only functional if the RAGapp is configured.

RAGapp doesn't come with any authentication layer by design. Just protect the `/admin` path in your cloud environment to secure your RAGapp.

## Deployment

### Using Docker Compose

We provide a [`docker-compose.yml`](./docker-compose.yml) file to make it easy to deploy RAGapp with [Ollama](https://ollama.com/) and [Qdrant](https://qdrant.tech/) in your own infrastructure.

Using the `MODEL` and `OLLAMA_BASE_URL` environment variables, you can specify which Ollama host and model to use, e.g. `llama3` and `http://host.docker.internal:11434`:

```shell
MODEL=llama3 OLLAMA_BASE_URL=http://host.docker.internal:11434 docker-compose up
```

If you don't specify the `MODEL` variable, the default model used is `phi3` and the `OLLAMA_BASE_URL` is http://ollama:11434 which points to the Ollama started by the docker-compose.

The `setup` container in the `docker-compose.yml` file will download the selected model into the [`ollama`](./ollama/) folder - this will take a few minutes.

### Kubernetes

It's easy to deploy RAGapp in your own cloud infrastructure. Customized K8S deployment descriptors are coming soon.

## Development

```shell
poetry install --no-root
make build-frontends
make dev
```

> _Note_: To check out the admin UI during development, please go to http://localhost:3000/admin.

## Contact

Questions, feature requests or found a bug? [Open an issue](https://github.com/ragapp/ragapp/issues/new/choose) or reach out to [marcusschiesser](https://github.com/marcusschiesser).
