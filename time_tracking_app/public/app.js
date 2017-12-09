
class TimerForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title || '',
      project: this.props.project || '',
    }
    this.handleProjectChange = this.handleProjectChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(){
    console.log('add timer');
    // invoke propos function
    this.props.onFormSubmit({
      id: this.props.id,
      title: this.state.title,
      project: this.state.project,
    });
  }
  handleTitleChange(e){
   console.log('change title');
   this.setState({ title: e.target.value });
  }
  handleProjectChange(e){
    this.setState({ project: e.target.value });
  }
  render() {
    const submitText = this.props.title ? 'Update' : 'Create'

    return(
      <div className="ui centered card">
        <div className="content">
          <div className="ui form">
            <div className="field">
              <label>Title</label>
              <input onChange = {this.handleTitleChange} type="text" value={ this.state.title } />
            </div>
            <div className="field">
              <label>Project</label>
              <input onChange = {this.handleProjectChange}  type="text" value={ this.state.project } />
            </div>
            <div className="ui two bottom attached buttons">
              <button onClick = {this.handleSubmit} className="ui basic blue button">
                {submitText}
              </button>
              <button onClick = {this.props.onFormClose} className="ui basic red button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class EditableTimer extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      editFormOpen: false,
    }
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleFormClose = this.handleFormClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.openForm = this.openForm.bind(this);
  }
// Inside EditableTimer
  handleEditClick () {
  this.openForm();
  };
  handleFormClose = () => {
    this.closeForm();
    };
  handleSubmit = (timer) => {
    this.props.onFormSubmit(timer);
    this.closeForm();
  };
    
  closeForm = () => {
    this.setState({ editFormOpen: false });
    };
  openForm = () => {
      this.setState({ editFormOpen: true });
  };
  
  render() {
    if (this.state.editFormOpen) {
      return(
        <TimerForm
          title   = { this.props.title }
          project = { this.props.project }
        />
    );
    } else {
      return(
        <Timer
          title        = { this.props.title }
          project      = { this.props.project }
          elapsed      = { this.props.elapsed }
          runningSince = { this.props.runningSince }
        />
      )
    }
  }
}

const EditableTimerList = React.createClass({
  render: function () {
    const timers = this.props.timers.map((timer) => (
      <EditableTimer
        key          = { timer.id }
        id           = { timer.id }
        title        = { timer.title }
        project      = { timer.project }
        elapsed      = { timer.elapsed }
        runningSince = { timer.runningSince }
      />
    ));

    return(
      <div id="timers">
        { timers }
      </div>
    )
  }
})

class ToggleableTimerForm extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    }
    this.handleFormOpen = this.handleFormOpen.bind(this);
    this.handleFormClose = this.handleFormClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  handleFormOpen(){
    this.setState({ isOpen: true });
  }
  handleFormClose () {
    this.setState({ isOpen: false });
  };
  handleFormSubmit (timer){
    this.props.onFormSubmit(timer);
    this.setState({ isOpen: false });
  };
  render() {
    if (this.state.isOpen) {
      return(
        <TimerForm 
        onFormSubmit={this.handleFormSubmit}
        onFormClose={this.handleFormClose}
        />
      )
    } else {
      return(
        <div className="ui basic content center aligned segment">
          <button onClick = {this.handleFormOpen} className="ui basic button icon">
            <i className="plus icon"></i>
          </button>
        </div>
      )
    }
  }
}

const Timer = React.createClass({
  render: function () {
    const elapsedString = helpers.renderElapsedString(this.props.elapsed);
    return(
      <div className="ui centered card">
        <div className="content">
          <div className="header">
            { this.props.title }
          </div>
          <div className="meta">
            { this.props.project }
          </div>
          <div className="center aligned description">
            <h2>{elapsedString}</h2>
          </div>
          <div className="extra content">
            <span className="right floated edit icon"
            onClick={this.props.onEditClick}
            >
              <i className="edit icon"></i>
            </span>
            <span className="right floated trash icon">
              <i className="trash icon"></i>
            </span>
          </div>
        </div>
        <div className="ui bottom attached blue basic button">
          Start
        </div>
      </div>
    )
  }
})

class TimersDashboard extends React.Component{
  constructor(props) {
    super(props);
    
    this.state = {
      timers: [
        {
          title: 'Pratice Squat',
          project: 'Gym Chores',
          id: uuid.v4(),
          elapsed: 5456099,
          runningSince: Date.now()
        },
        {
          title: 'Bake Squash',
          project: 'kitchen Chores',
          id: uuid.v4(),
          elapsed: 1273998,
          runningSince: null
        },
      ],
    }
   this.handleCreateFormSubmit = this.handleCreateFormSubmit.bind(this);
   this.createTimer = this.createTimer.bind(this);
 };
handleCreateFormSubmit (timer){
  this.createTimer(timer);
};
createTimer(timer){
  const t = helpers.newTimer(timer);
  this.setState({
    timers: this.state.timers.concat(t),
  });
};
 
  render() {
    return(
      <div className="ui three column centered grid">
        <div className="column">
          <EditableTimerList
            timers={this.state.timers}
          />
          <ToggleableTimerForm isOpen={true} 
          onFormSubmit={this.handleCreateFormSubmit} />
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <TimersDashboard />,
  document.getElementById('content')
);
