# Docker and Infrastructure Dependencies

In KillrVideo, we offer microservice implementations in multiple programming languages, but
each of these implementations have a base common set of dependencies they need in order
to be a functional reference application. Those base dependencies are:

- [**DataStax Enterprise**][dse]: we need at least one node of DSE / Cassandra running that
the microservices implementations can use to store data.
- [**KillrVideo Web Tier**][killrvideo-web]: we need the Web Tier in order to provide a
working UI and application that drives calls to the microservices.
- [**etcd**][etcd]: we use etcd as our service registry for service discovery so that our
microservices know where to find DSE and our Web Tier knows where to find our microservices.

For a developer looking to learn about Cassandra and DSE it would be impractical (and kind
of ridiculous) to ask them to install all of these things locally in addition to the code
for the microservices implementation they are interested in. Instead, we've chosen to use
[Docker][docker] to run these dependencies. Docker has become an increasingly popular way
for developers to run infrastructure on their local dev machines. This way, the only thing a
developer needs to install is Docker for Mac or Windows in order to try out KillrVideo (and 
chances are they may already have it installed).

## Docker Compose for Starting Dependencies

The [Docker][docker] project offers a nice tool called [Docker Compose][compose] which
allows you to run multiple Docker containers that are defined in a `.yaml` file. We created
the [killrvideo-docker-common][docker-common] project to house the configuration that is the
same across many of our projects. This project includes two main things:

- A base `docker-compose.yaml` configuration that includes etcd, a single DSE node, and 
[Registrator][registrator], a program that automatically registers and deregisters Docker 
containers with our Etcd service registry when they are started and stopped.
- Helper scripts (for Windows and Mac) that can be used to determine the Docker network
setup on a developer's machine so we know what IP addresses the components can use to
communicate with each other.

You might notice that the Web Tier is not listed as one of the dependencies specified in the
base `docker-compose.yaml` file. This is because the [killrvideo-web][killrvideo-web]
project also depends on the [killrvideo-docker-common][docker-common] project to spin up 
dependencies when it's being developed. In the microservice implementations, we take 
advantage of a feature of Docker Compose that lets us define a `.yaml` file that inherits
from our base `.yaml` file and then provide overrides and additions. In this way, each
programming language's microservice project can specify the Web Tier as a dependency (along
with any other infrastructure they might need, for example, messaging infrastructure, or 
[DataStax Studio][studio].

## Docker Environment Scripts

As mentioned above, the [killrvideo-docker-common][docker-common] project also contains some
scripts that are useful for determining a developer's Docker setup. These scripts can be
used to create a `.env` file which is used by [Docker Compose][compose] when it runs to set
environment variables needed by KillrVideo. That `.env` file can also be used by the various
microservice implementations to make sure that they register themselves with the appropriate
IP address in [etcd][etcd] for service discovery. The output from those scripts is:

- `KILLRVIDEO_DOCKER_IP`: the Docker VM's IP where the containers are hosted. This is where
the Web UI, DSE node, and etcd are available.
- `KILLRVIDEO_HOST_IP`: the IP address of the user's local dev machine. This is the IP
address that the microservices should use to listen on and to register themselves with etcd.
- `KILLRVIDEO_DOCKER_TOOLBOX`: set to either `true` or `false` depending on whether the
local docker environment is a Docker Toolbox setup.

Once we have the `docker-compose.yaml` files described above, as well as a `.env` file from
running the helper scripts, it's easy to start all our infrastructure dependencies by simply
running:

```
> docker-compose up
```

Next, we'll take a quick look at service discovery in KillrVideo with etcd.

[Next: Service Discovery with etcd][next]


[next]: /docs/guides/service-discovery/
[dse]: http://www.datastax.com/products/datastax-enterprise
[killrvideo-web]: https://github.com/killrvideo/killrvideo-web
[etcd]: https://github.com/coreos/etcd
[docker]: https://www.docker.com/
[compose]: https://docs.docker.com/compose/overview/
[docker-common]: https://github.com/KillrVideo/killrvideo-docker-common
[registrator]: http://gliderlabs.com/registrator/latest/
[studio]: https://www.datastax.com/products/datastax-studio-and-development-tools