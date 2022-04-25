# shell版本问题

LinuxOS的shell有很多种版本：Bourne Shell、Bourne Again Shell(bash)、C Shell、KornShell、ash、zsh等

Bourne Shell(即sh)是UNIX最初使用的shell，平且在每种UNIX上都可以使用。BourneShell在shell编程方便相当优秀，但在处理与用户的交互方便作得不如其他几种shell。

LinuxOS默认的是Bourne Again Shell，它是Bourne Shell的扩展，简称bash，与BourneShell完全兼容，并且在BourneShell的基础上增加，增强了很多特性。可以提供命令补全，命令编辑和命令历史等功能。它还包含了很多C Shell和KornShell中的优点，有灵活和强大的编辑接口，同时又很友好的用户界面，ubuntu下的shell版本就是bash。

C Shell是一种比Bourne Shell更适合的变种Shell，它的语法与C语言很相似。Linux为喜欢使用CShell的人提供了Tcsh。
Tcsh是CShell的一个扩展版本。Tcsh包括命令行编辑，可编程单词补全，拼写校正，历史命令替换，作业控制和类似C语言的语法，他不仅和BashShell提示符兼容，而且还提供比Bash Shell更多的提示符参数。

Korn Shell集合了C Shell和Bourne Shell的优点并且和BourneShell完全兼容。Linux系统提供了pdksh（ksh的扩展），它支持人物控制，可以在命令行上挂起，后台执行，唤醒或终止程序。

Linux还包括了一些流行的Shell如：ash，zsh等。每个Shell都有它的用途，有些Shell是有专利的，有些能从Internet或其他来源获得。


不同shell版本设置临时环境变量命令的对应关系如下：
#### 在 csh shell:
```shell
setenv PATH "$PATH:/usr/local/bin/python"
```

#### 在 sh 或者 ksh shell:
```shell
PATH="$PATH:/usr/local/bin/python"
```

#### 在 bash shell (Linux):
```shell
export PATH="$PATH:/usr/local/bin/python"
```
如果要将环境变量持久化，可编辑文件
```shell
vim /etc/profile  # 新增一行：export ENV_TYPE=dev
. /etc/profile 或 source /etc/profile  # source与.是一样的效果，都是重新执行对应文件使文件在当前窗口立即生效
env  # 查看当前环境变量
python3  # 打开python控制台
>>>import os  # 准备获取环境变量
>>>os.environ.get('ENV_TYPE') # 输出'dev'
```

# Linux中Bash环境变量设置
在Linux中，我们一般将环境变量信息配置到不同的文件中，常用的配置文件有
```bash
/etc/profile
/etc/bashrc
~/.bash_profile
~/.bashrc
~/.bash_logout
```
上面几个配置主要是在交互式登录Shell和交互式非登录Shell有区别，会加载不同的配置。

* 交互式登录Shell：就是登录Linux系统，你输入用户名和密码后执行的，或su -l. 用户名方式

* 非登录Shell：就是你进入系统后，开一个终端Bash执行的。

### /etc/profile
一般为系统配置，为系统的每个用户设置环境信息, 当用户第一次登录时,该文件被执行, 并从/etc/profile.d目录的配置文件中搜集shell的设置.

对 /etc/profile的修改必须得重启才会生效，而且每个用户都是有效的。

### /etc/profile.d/
可以理解为/etc/profile的一部分，只不过可以根椐类别或功能将配置拆分成若干个文件，这样更清晰也便于维护。

### /etc/bashrc
为每个运行 Bash Shell 的用户执行该文件，当Bash Shell打开时，该文件被执行，其配置对所有使用bash的用户打开的每个Bash都有效。当被修改后，不用重启只需要打开一个新的 Bash 即可生效。

### ~/.bash_profile
文件在用户目录下，为当前用户设置专属的环境信息和启动程序，当用户登录时该文件执行一次，并执行当前用户的 .bashrc 文件。如果有修改，也需要重启才能生效。

### ~/.bashrc
为当前用户设置专属的 Bash 信息，当每次打开新的Shell时，该文件被执行。如有修改，不需要重启只需要开一个新的Shell终端就行了。

### ~/.bash_logout
当前用户每次退出Bash Shell时执行该文件。

>以上需要重启才能生效的文件，是通过类似 source ~/.bash_profile这样的方式暂时生效的，并不是真的重启电脑。
