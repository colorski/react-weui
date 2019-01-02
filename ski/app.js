import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button, Article} from 'react-weui';

//import styles
import 'weui';
import 'react-weui/build/dist/react-weui.css';


class App extends Component {
    render() {
        return (
            <Article>
                <h1>H1 Heading</h1>
                <section>
                    <h2 className="title">H2 Title</h2>
                    <h3>H3 Heading</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </section>
                <Button>Hello World</Button>
            </Article>
        );
    }
}


ReactDOM.render((
    <App/>
), document.getElementById('container'));
