# Setting up the Git Repo

We're sure you can handle creating a new empty Git repository. But once you have your initial
commit with a `README.md`, `.gitignore`, etc., you'll want to pull in the common KillrVideo 
dependencies that live in other Git repositories. The repositories you'll want to pull in 
are:

- [killrvideo-service-protos][service-protos]: This is where the [gRPC][grpc] service 
definitions that you'll be implementing are kept, defined in `.proto` files. You'll be using
the Protobufs from here to generate code.
- [killrvideo-docker-common][docker-common]: This is where common Docker setup scripts live,
including a Docker Compose `.yaml` file for the base infrastructure dependencies needed to
run KillrVideo.

## Using Git Subtrees for Dependencies

In other microservice implementations, we've decided to use `git subtree` to pull in these
dependencies rather than submodules. Here's a [pretty good overview][subtree] of subtrees if
you're not familiar. Here's an example of the commands to add those subtrees to your 
repository under the `/lib` folder:

```bash
# Add killrvideo-service-protos under lib/killrvideo-service-protos
git subtree add --prefix lib/killrvideo-service-protos git@github.com:KillrVideo/killrvideo-service-protos.git master --squash

# Add killrvideo-docker-common under lib/killrvideo-docker-common
git subtree add --prefix lib/killrvideo-docker-common git@github.com:KillrVideo/killrvideo-docker-common.git master --squash
```

Later if you need to update those dependencies you can just use the same commands as above,
only doing a `git subtree pull` instead of `git subtree add`.

<div class="message is-info">
  <div class="message-header">
    <span class="icon"><i class="fa fa-info-circle"></i></span> Subtree Tip
  </div>
  <div class="message-body">
    Add a shell script to your repo for doing a <code>git subtree pull</code> on those 
    dependencies to make it easy to pull down the latest changes.
  </div>
</div>

[service-protos]: https://github.com/KillrVideo/killrvideo-service-protos
[docker-common]: https://github.com/KillrVideo/killrvideo-docker-common
[grpc]: http://www.grpc.io/
[subtree]: http://blogs.atlassian.com/2013/05/alternatives-to-git-submodule-git-subtree/