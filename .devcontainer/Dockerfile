# For details, see https://github.com/devcontainers/images/tree/main/src/ruby
FROM mcr.microsoft.com/devcontainers/ruby:1-3.2-bullseye

# Install Rails
# RUN gem install rails webdrivers

ARG NODE_VERSION="16"
RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} 2>&1"

# [Optional] Uncomment this section to install additional OS packages.

RUN sudo sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list
RUN sudo sed -i 's|security.debian.org/debian-security|mirrors.ustc.edu.cn/debian-security|g' /etc/apt/sources.list

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends libicu-dev libidn11-dev ffmpeg imagemagick libpam-dev

# [Optional] Uncomment this line to install additional gems.
RUN gem install foreman

# [Optional] Uncomment this line to install global node packages.
RUN npm config set registry https://repo.nju.edu.cn/repository/npm/
RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && npm install -g yarn" 2>&1
RUN yarn config set registry https://repo.nju.edu.cn/repository/npm/

COPY welcome-message.txt /usr/local/etc/vscode-dev-containers/first-run-notice.txt
