var my_news=[
    {
        author: 'Ivan Ivanov',
        text: 'Hello russia ',
        bigText: '11111asdasdadfagfahfqwjqhdh!HDHAJSDHjh DHAsidhkhdasd'
    },
    {
        author: 'Simple Ivan',
        text: 'I hope $ = 30 rub ',
        bigText: '22222asdasdadfagfahfqwjqhdasdasd'
    },
    {
        author: 'Guest',
        text: 'Free Hugs',
        bigText: '33333asdasdadfagfahfqwjqhdasdasd'
    },
    {
        author: 'Me',
        text: 'You remember??',
        bigText: '44444asdasdadfagfahfqwjqhdasdasd'
    }
];
window.ee = new EventEmitter();

var Article = React.createClass({
    propTypes:{
        data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
        })
    },
    getInitialState: function () {
        return{
            visible: false
        };
    },

    readmoreClick: function (e) {
        e.preventDefault();
        this.setState({visible: true});
    },

    render: function () {
        var author = this.props.data.author;
        var text = this.props.data.text;
        var bigText = this.props.data.bigText;
        var visible = this.state.visible;


        return(
            <div className="article">
                <p className="news__author">{author}:</p>
                <p className="news__text">{text}</p>

                <a href="#"
                   onClick={this.readmoreClick}
                   className={"news__readmore " + (visible ? "none" : "")}>
                    Show all
                </a>

                <p className={"news__big-text " + (visible ? '': 'none')}>{bigText}</p>
            </div>
        )
    }
});

var News = React.createClass({
    propTypes:{
        data: React.PropTypes.array.isRequired
    },
    getInitialState:function () {
        return{
            counter:0
        }
    },

    render: function () {
        var data = this.props.data;
        var newsTemplate;

        if(data.length > 0){
            newsTemplate = data.map(function (item, index) {
                return(
                    <div key={index}>
                        <Article data={item} />
                    </div>
                )
            })
        } else {
            newsTemplate = <p>Unfortunately there is no news</p>
        }


        return (
            <div className="news">
                {newsTemplate}
                <strong className={'news__count ' + (data.length > 0 ? '': 'none') }>All news: {data.length}</strong>
            </div>
        )
    }
});

var Add = React.createClass({
    getInitialState:function () {
        return {
            agreeNotChecked: true,
            authorIsEmpty: true,
            textIsEmpty: true
        };
    },
    componentDidMount:function () {
        ReactDOM.findDOMNode(this.refs.author).focus();
    },

    onBtnClickHandler: function (e) {
        e.preventDefault();
        var textEl = ReactDOM.findDOMNode(this.refs.text);

        var author = ReactDOM.findDOMNode(this.refs.author).value;
        var text = textEl.value;

        var item =[{
            author: author,
            text: text,
            bigText: '...'
        }];

        window.ee.emit('News.add', item);

        textEl.value = '';
        this.setState({textIsEmpty: true});
    },

    onCheckRuleClick:function (e) {
        this.setState({agreeNotChecked: !this.state.agreeNotChecked});
    },
    onFieldChange: function (fieldname, e) {
        var next ={};
        if(e.target.value.trim().length > 0) {
            next[fieldname] = false;
            this.setState(next);
        }else{
            next[fieldname] = true;
            this.setState(next);
        }
    },

    render: function () {
        var agreeNotChecked = this.state.agreeNotChecked,
            authorIsEmpty = this.state.authorIsEmpty,
            textIsEmpty = this.state.textIsEmpty;
        return(

            <form className="add cf">
                <input
                    type="text"
                    className="add__author"
                    onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
                    placeholder="Your name"
                    ref='author'
                />
                <textarea
                    className="add__text"
                    onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
                    placeholder="Text of news"
                    ref='text'
                >
                </textarea>
                <label className="add__checkrule">
                    <input type="checkbox" ref='checkrule' onChange={this.onCheckRuleClick}/>I agree with rules
                </label>
                <button
                    className="add__btn"
                    onClick={this.onBtnClickHandler}
                    ref='alert_button'
                    disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}>
                    Add news
                </button>

            </form>

        )
    }

});

var App = React.createClass({

    getInitialState: function () {
        return {
            news: my_news
        };
    },

    componentDidMount: function () {
        var self = this;
        window.ee.addListener('News.add', function (item) {
            var nextNews = item.concat(self.state.news);
            self.setState({news: nextNews});
        });
    },

    componentWillUnmount: function () {
        window.ee.removeListener('News.add');
    },


    render: function () {
        console.log('render');
        return(
            <div className="app">
                <Add/>
                <h3>News</h3>
                <News data={this.state.news}/>
            </div>
        );
    }
});

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);