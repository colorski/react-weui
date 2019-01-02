# 基于react-weui构建react开发脚手架代码

# 1.下载 github最新源码

下载地址：[https://github.com/weui/react-weui](https://github.com/weui/react-weui)

重点就是要看中间的这3个文件

> *package.json* 编辑和运行的脚本都在这个里面
> 
> *webpack.config.js* webpack打包配置文件
> 
> *webpack.config.doc.js* webpack打包配置文件（doc）

# 2.初始化项目 

#### 命令如下：

安装项目内部的npm包

``` 
cnpm install
```

安装相关的npm包

``` 
cnpm install --save react react-dom
cnpm install --save weui@1.1.0 react-weui
#这里一定要指明webpack版本 因为如果使用webpack会自动安装webpack4，后面会产生版本异常*
cnpm install --save webpack@3
#目前版本还是 2.x 不过还是指明出来*
cnpm install  --save webpack-dev-server@2
cnpm install --save autoprefixer
cnpm install --save html-webpack-plugin
cnpm install --save extract-text-webpack-plugin
cnpm install --save open-browser-webpack-plugin
cnpm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react babel-preset-stage-0
```
# 3.编译打包

这里不采用，官方提供的build脚本。我们基于webpack创建一个。

打开***webpack.js ***在**script**中加入下面代码

```
"build:example": "webpack --config webpack.config.js --progress --colors -p", 
"start:example": "webpack-dev-server --config webpack.config.js --inline --progress --colors --port 8080",
```

# 4.运行example示例项目

```
cnpm run start:example
```

# 5.构建并运行doc示例项目

因为package.json中有了 start:doc脚本，所以我们只需加入

```
"build:doc": "webpack --config webpack.config.doc.js --progress --colors -p",
```

下面运行 

```
cnpm run build:doc
```

#### 启动doc

```
cnpm run start:doc
```

# 6.构建自己的手脚架

接下来就通过简单的模仿，构建自己的APP脚手架。

### 1.创建项目world

### 2.创建文件 index.html和app.js

***index.html***
```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
    <title>world</title>
</head>
<body ontouchstart>
<div class="container" id="container"></div>
</body>
</html>

```
***app.js***
```
import React, { Component } from "react";
import PropTypes from 'prop-types';
import { render } from "react-dom";
import ReactDOMServer from "react-dom/server";
import { transform } from "babel-standalone";

class Preview extends Component {

  static defaultProps = {
    previewComponent: "div"
  };

  static propTypes = {
    code: PropTypes.string.isRequired,
    scope: PropTypes.object.isRequired,
    previewComponent: PropTypes.node,
    noRender: PropTypes.bool,
    context: PropTypes.object
  };

  constructor(props){
      super(props)
      this.state = {
        error: null
      };
  }


  _compileCode = () => {
    const { code, context, noRender, scope } = this.props;
    const generateContextTypes = (c) => {
      return `{ ${Object.keys(c).map(val =>
        `${val}: React.PropTypes.any.isRequired`).join(", ")} }`;
    };

    if (noRender) {
      return transform(`
        ((${Object.keys(scope).join(", ")}, mountNode) => {
          class Comp extends React.Component {
            getChildContext() {
              return ${JSON.stringify(context)};
            }
            render() {
              return (
                ${code}
              );
            }
          }
          Comp.childContextTypes = ${generateContextTypes(context)};
          return Comp;
        });
      `, { presets: ["es2015", "react", "stage-1"] }).code;
    } else {
      return transform(`
        ((${Object.keys(scope).join(",")}, mountNode) => {
          ${code}
        });
      `, { presets: ["es2015", "react", "stage-1"] }).code;
    }

  };

  _setTimeout = (...args) => {
    clearTimeout(this.timeoutID); //eslint-disable-line no-undef
    this.timeoutID = setTimeout.apply(null, args); //eslint-disable-line no-undef
  };

  _executeCode = () => {
    const mountNode = this.refs.mount;
    const { scope, noRender, previewComponent } = this.props;
    const tempScope = [];

    try {
      Object.keys(scope).forEach(s => tempScope.push(scope[s]));
      tempScope.push(mountNode);
      const compiledCode = this._compileCode();
      //console.log(compiledCode);
      if (noRender) {
        /* eslint-disable no-eval, max-len */
        const Comp = React.createElement(
          eval(compiledCode).apply(null, tempScope)
        );
        ReactDOMServer.renderToString(React.createElement(previewComponent, {}, Comp));
        render(
          React.createElement(previewComponent, {}, Comp),
          mountNode
        );
      } else {
        eval(compiledCode).apply(null, tempScope);
      }
      /* eslint-enable no-eval, max-len */

      this.setState({ error: null });
    } catch (err) {
      this._setTimeout(() => {
        this.setState({ error: err.toString() });
      }, 500);
    }
  };

  componentDidMount = () => {
    this._executeCode();
  };

  componentDidUpdate = (prevProps) => {
    clearTimeout(this.timeoutID); //eslint-disable-line
    if (this.props.code !== prevProps.code) {
      this._executeCode();
    }
  };

  render() {
    const { error } = this.state;
    return (
      <div>
        {error !== null ?
          <div className="playgroundError">{error}</div> :
          null}
        <div ref="mount" className="previewArea"/>
      </div>
    );
  }

}

export default Preview;
```


### 3.构建build和start脚本

```
"build:world": "webpack --config webpack.config.world.js --progress --colors -p", 
"start:world": "webpack-dev-server --config webpack.config.world.js --inline --progress --colors --port 8080",
```

![image](http://upload-images.jianshu.io/upload_images/2289531-21534181e298b4da?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 4.创建webpack.config.world.js

复制 webpack.config.js 修改 11,12,13行如下

```
const jsSourcePath = path.join(__dirname, 'world');
const buildPath = path.join(__dirname, 'build/demo/world');
const sourcePath = path.join(__dirname, 'world');
```

### 5.run build&start

```
cnpm run build:world
cnpm run start:world
```

* * *

以上内容修改自原文：[https://gitee.com/wmdzkey/react-weui-scaffold](https://gitee.com/wmdzkey/react-weui-scaffold)
