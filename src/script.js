const SPLIT_TIME_DISPLAY_INTERVAL = 300;
const destination = document.querySelector('#root');



class Counter extends React.Component {
    render() {
        return <div className={'stopwatch'}>{this.props.value}</div>
    }
}

class Button extends React.Component {
    render() {
        return (<a href='#' className='button' id={this.props.id} onMouseDown={this.props.onClick}>{this.props.name}</a>)
    }
}

class ResultList extends React.Component {
    render() {   
        //OL reversed displays list in reversed order (last split time is first on the results list) 
        return (
        <div className='resultList'>
            <ol reversed={'reversed'} className={'results'}>{this.props.value}</ol>
            <Button id={'clear'} onClick={this.props.onButtonClick} name={'Clear split times list'} />
        </div>
        )
    }
}

class Stopwatch extends React.Component {
    constructor() {
        super();
        this.state = {
            running: false,
            times: {
                minutes: 0,
                seconds:0,
                miliseconds:0
            },
            splitTimes: []
        }
        this.printTime = this.format(this.state.times);
        this.buttonStopName = 'Stop';
    }

    render() {
        return (
            <div>
                <div className={'app'}>
                    <nav className={'controls'}>
                        <Button id={'start'} onClick={this.start} name={'Start'}/>
                        <Button id={'split'} onClick={this.split} name={'Split'}/>
                        <Button id={'stop'} onClick={this.stop} name={this.buttonStopName}/>
 
                    </nav>
                    <Counter value={this.printTime} />
                </div>
                <ResultList value={this.printSplitTimes()} onButtonClick={this.clear} />
            </div>
        )

    }

    reset = () => {
        let timesTemp = this.state.times;
        timesTemp.minutes = timesTemp.seconds = timesTemp.miliseconds = 0;
        this.setState({times:timesTemp});
    }

    printSplitTimes = () => {
        const items = this.state.splitTimes.map( (item, id) => {

            
            return (
                <li key={id}>{item}</li>
            );
        });
        return items;
    }

    print = (times = this.state.times) => {
        this.printTime = this.format(times) 
        
    }

    format = (times) => {
        return `${pad0(times.minutes)}:${pad0(times.seconds)}.${pad0(Math.floor(times.miliseconds))}`;
    }

    start = () => {
        // console.log(this.state.running);
        if(!this.state.running) {
            this.setState({running: true});
            this.watch = setInterval(() => {
                this.step();      
            }, 10);
            this.displayTime = setInterval(() => this.print(),10);
            this.buttonStopName = 'Stop';
        }
    }

    step = () => {
        if(!this.state.running) return;
        this.calculate();
    }

    calculate = () => {
        let timesTemp = this.state.times;

        timesTemp.miliseconds += 1;
        if( timesTemp.miliseconds >= 100) {
            timesTemp.seconds += 1;
            timesTemp.miliseconds = 0;
        }
        if(timesTemp.seconds >= 60) {
            timesTemp.minutes += 1;
            timesTemp.seconds = 0;    
        }
        this.setState({times: timesTemp})
    }

    stop = () => {
        //stop stopwatch
        if(this.state.running) {
            this.setState({running: false});
            clearInterval(this.watch);
            clearInterval(this.displayTime);
            this.buttonStopName = 'Reset';

        //if stopwatch is stoped next click resets stopwatch    
        } else {
            this.reset();
            this.print();
            this.buttonStopName = 'Stop';
            
        }
        
    }

    //add split time to results list
    split = () => {
        if(this.state.running) {
            let currentSplitTime = this.state.times;

            this.setState({
                splitTimes: [this.format(currentSplitTime), ...this.state.splitTimes]
            });


            clearInterval(this.displayTime);
            clearTimeout(this.timeoutSplitTime);
            //display split time 
            this.print(currentSplitTime);
            this.timeoutSplitTime = setTimeout(() => {  
                this.displayTime = setInterval(() => this.print(),10);
                
            }, SPLIT_TIME_DISPLAY_INTERVAL);
           
        }
        else return;
    }

    clear = () => {
        this.setState({
            splitTimes: []
        });
    }
}

ReactDOM.render(
    <Stopwatch/>
    , destination);

function pad0(value) {
    let result = value.toString();
    if(result.length < 2) {
        return '0' + result;
    }
    return result;
}
