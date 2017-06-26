import React from 'react';
import Header from '../util/header';
import * as StorageAPI from '../../util/storage_util';
import { connect } from 'react-redux';
import { fetchProject } from '../../actions/project_actions';
import { selectProject, currentStories } from '../../util/selectors';
import { addStory } from '../../actions/story_actions';
import { initStory } from '../story/story_util'
import NavPanel from './nav_panel'
import StoryPanel from '../story/story_panel'

const theTabs = {
  add: {
    title: 'Add Story',
    visible: true,
    storyToAdd: 'unstarted'
  },
  current: {
    title: 'Current iteration/backlog',
    nav_title: 'Current/backlog',
    visible: true,
    storyToAdd: 'started'
  },
  assigned: {
    title: 'My Work',
    visible: true
  },
  unstarted: {
    title: 'Icebox',
    visible: true,
    storyToAdd: 'unstarted'
  },
  done: {
    title: 'Done',
    visible: false
  }
}

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.retrieveState();
    this.handleNav = this.handleNav.bind(this);
  }

  componentDidMount() {
    this.props.fetchProject(this.props.project_id)
  }

  componentWillReceiveProps({ project_id }) {
    if (project_id !== this.props.project_id) {
      this.setState(this.retrieveState(project_id));
    }
  }

  render() {
    return (
      <div className='project'>
        <Header/>
        <div className='content'>
          <NavPanel tabs={this.state.tabs} handleNav={this.handleNav}/>
          {this.renderPanels()}
        </div>
      </div>
    );
  }

  renderPanels() {
    const panels = [];
    const { tabs } = this.state;
    Object.keys(tabs).forEach(key => {
      const tab = tabs[key];
      if (key !== 'add' && tab.visible) {
        const stories = this.props.stories &&
          this.props.stories.filter(story =>
            this.filter(story, key)
          );
        panels.push(
          <StoryPanel
            key={key}
            title={tab.title}
            stories={stories}
            handleAdd={this.handleAdd(key)}
            handleClose={this.handleClose(key)}
            />
        );
      }
    });
    return panels;
  }

  filter(story, key) {
    switch (key) {
      case 'unstarted': return story.state === 'unstarted';
      case 'current': return !['accepted', 'unstarted'].includes(story.state);
      case 'assigned': return false;
      case 'done': return story.state === 'accepted';
      default: return true;
    }
  }

  handleClose(id) {
    return (e) => {
      e.stopPropagation();
      this.toggleNav(id);
    }
  }

  handleNav(id) {
    return (e) => {
      e.stopPropagation();
      if (id === 'add') {
        this.addStory(theTabs[id].storyToAdd);
      } else {
        this.toggleNav(id);
      }
    }
  }

  handleAdd(tab_id) {
    return theTabs[tab_id].storyToAdd
      ? (e) => this.addStory(theTabs[tab_id].storyToAdd)
      : null;
  }

  addStory(state) {
    const { user_id, project_id } = this.props;
    this.props.addStory(initStory({ user_id, project_id, state }));
    if (state === 'unstarted' && !this.state.tabs['unstarted'].visible) {
      this.toggleNav('unstarted');
    }
  }

  toggleNav(id) {
    this.setState(prevState => {
      const newState = Object.assign({}, prevState);
      newState.tabs[id].visible = !prevState.tabs[id].visible;
      this.saveState(newState);
      return newState;
    });
  }

  saveState({ tabs }) {
    const state = {};
    Object.keys(tabs).forEach(key => {
      state[key] = { visible: tabs[key].visible }
    });
    StorageAPI.set(this.getKey(), state);
  }

  retrieveState(project_id = null) {
    const state = Object.assign({}, { tabs: theTabs }, this.state);
    const { tabs } = state;
    const savedState = StorageAPI.get(this.getKey(project_id));
    Object.keys(savedState).forEach(key => {
      if (tabs[key]) {
        tabs[key].visible = savedState[key].visible;
      }
    });
    return state;
  }

  getKey(project_id = null) {
    return `project_${project_id || this.props.project_id}`;
  }
}

const mapStateToProps = (state, ownProps) => {
  const user_id = state.session.currentUser.id;
  const project_id = ownProps.match.params.id;
  const project = selectProject(state, ownProps);
  const stories = project && Object.keys(state.stories)
    .map(id => state.stories[id])
    .filter(story => story.project_id == project.id);
  return { user_id, project_id, project, stories };
};

const mapDispatchToProps = dispatch => ({
  fetchProject: id => dispatch(fetchProject(id)),
  addStory: story => dispatch(addStory(story)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Project);
