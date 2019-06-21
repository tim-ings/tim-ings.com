import React from 'react';
import {__DEV__} from 'react';
import ResumeData from '../data/resume.json';
import Octokit from "@octokit/rest";
import Container from 'react-bootstrap/Container';
import TestEventData from './event_log.json';
import Octicon, { IssueOpened, RepoPush, Comment, Repo, IssueClosed, GitCommit } from '@primer/octicons-react';

class GitHubEventList extends React.Component {

    constructor(props) {
        super();
    }

    isUnique(arr, obj, key) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][key] === obj[key]) {
                return false;
            }
        }
        return true;
    }

    render() {
        if (this.props.events.length <= 0) {
            return (<></>);
        }


        let eventPushes = [];
        let commit_repoCommitCounts = {};
        let commit_count = 0;
        let commit_uniqueRepos = [];

        let eventCreates = [];

        let eventIssuesOpened = [];
        let issue_openedUniqueRepos = [];

        let eventIssuesClosed = [];
        let issue_closedUniqueRepos = [];
        
        let eventComments = [];
        let comment_uniqueRepos = [];

        for (let i = 0; i < this.props.events.length; i++) {
            let ghe = this.props.events[i];
            switch (ghe.type) {
                case "IssueCommentEvent": 
                    if (this.isUnique(comment_uniqueRepos, ghe.repo, "id"))
                        comment_uniqueRepos.push(ghe.repo);
                    eventComments.push(ghe);
                    break;
                case "PushEvent":
                    commit_count += ghe.payload.commits.length;
                    if (!(ghe.repo.id in commit_repoCommitCounts)) commit_repoCommitCounts[ghe.repo.id] = 0;
                    commit_repoCommitCounts[ghe.repo.id] += ghe.payload.commits.length;
                    if (this.isUnique(commit_uniqueRepos, ghe.repo, "id"))
                        commit_uniqueRepos.push(ghe.repo);
                    eventPushes.push(ghe);
                    break;
                case "IssuesEvent":
                    switch (ghe.payload.action) {
                        case "opened":
                            if (this.isUnique(issue_openedUniqueRepos, ghe.repo, "id"))
                                issue_openedUniqueRepos.push(ghe.repo);
                            eventIssuesOpened.push(ghe);
                            break;
                        case "closed":
                            if (this.isUnique(issue_closedUniqueRepos, ghe.repo, "id"))
                                issue_closedUniqueRepos.push(ghe.repo);
                            eventIssuesClosed.push(ghe);
                            break;
                        default: 
                            console.log("Unknown issue action:", ghe.payload.action);
                            break;
                    }
                    break;
                case "CreateEvent":
                    eventCreates.push(ghe);
                    break;
                default:
                    console.log("unknown event type:", this.props.events.type);
            }
        }

        // commits
        let activityTags_commit = [];
        for (let i = 0; i < commit_uniqueRepos.length; i++) {
            let repo = commit_uniqueRepos[i];
            let commitTags = [];
            for (let j = 0; j < eventPushes.length; j++) {
                let ghe = eventPushes[j];
                for (let k = 0; k < ghe.payload.commits.length; k++) {
                    commitTags.push(
                        <li key={`${j}${k}`}>
                            <Octicon icon={GitCommit} />
                            <a href={`https://github.com/tim-ings/tim-ings.com/commit/${ghe.payload.commits[k].sha}`}>
                                {ghe.payload.commits[k].message}
                            </a>
                        </li>);
                }
            }
            activityTags_commit.push(
                <li key={i}>
                    <a 
                    href="javascript:;" 
                    role="button" 
                    onClick={() => {document.querySelector(`#commits-list-repo-${repo.id}`).classList.toggle("hidden")}}
                    className="dropdown">
                        {commit_uniqueRepos[i].name}
                    </a> <a href={`https://github.com/${repo.name}/commits?author=${ResumeData.contacts.github}`}>
                        {commit_repoCommitCounts[commit_uniqueRepos[i].id]} commits
                    </a>
                    <ul id={`commits-list-repo-${repo.id}`} className="hidden">
                        {commitTags}
                    </ul>
                </li>
            );
        }

        // creates
        let activityTags_create = [];
        for (let i = 0; i < eventCreates.length; i++) {
            let ghe = eventCreates[i];
            activityTags_create.push(
                <li key={i}>
                    <a href={`https://github.com/${ghe.repo.name}`}>{ghe.repo.name}</a> 
                </li>
            );
        }
        
        // issues opened
        let activityTags_issuesOpened = [];
        for (let i = 0; i < issue_openedUniqueRepos.length; i ++) {
            let repo = issue_openedUniqueRepos[i];
            let issueTags = [];
            for (let j = 0; j < eventIssuesOpened.length; j++) {
                let ghe = eventIssuesOpened[j];
                issueTags.push(
                    <li key={j}>
                        <Octicon icon={IssueOpened} />
                        <a href={ghe.payload.issue.html_url}>
                            {ghe.payload.issue.title}
                        </a>
                    </li>
                );
            }
            activityTags_issuesOpened.push(
                <li key={i}>
                    <a 
                    href="javascript:;" 
                    role="button" 
                    onClick={() => {document.querySelector(`#issue-opened-list-repo-${repo.id}`).classList.toggle("hidden")}}
                    className="dropdown">
                        {repo.name}
                    </a>
                    <ul id={`issue-opened-list-repo-${repo.id}`} className="hidden">
                        {issueTags}
                    </ul>
                </li>
            );
        }

        // issues closed
        let activityTags_issuesClosed = [];
        for (let i = 0; i < issue_closedUniqueRepos.length; i ++) {
            let repo = issue_closedUniqueRepos[i];
            let issueTags = [];
            for (let j = 0; j < eventIssuesClosed.length; j++) {
                let ghe = eventIssuesClosed[j];
                issueTags.push(
                    <li key={j}>
                        <Octicon icon={IssueClosed} />
                        <a href={ghe.payload.issue.html_url}>
                            {ghe.payload.issue.title}
                        </a>
                    </li>
                );
            }
            activityTags_issuesClosed.push(
                <li key={i}>
                    <a href="javascript:;" 
                    role="button" 
                    onClick={() => {document.querySelector(`#issue-closed-list-repo-${repo.id}`).classList.toggle("hidden")}}
                    className="dropdown">
                        {repo.name}
                    </a>
                    <ul id={`issue-closed-list-repo-${repo.id}`} className="hidden">
                        {issueTags}
                    </ul>
                </li>
            );
        }

        // comments
        let activityTags_comments = [];
        for (let i = 0; i < comment_uniqueRepos.length; i++) {
            let repo = comment_uniqueRepos[i];
            let commentTags = [];
            for (let j = 0; j < eventComments.length; j++) {
                let ghe = eventComments[j];
                commentTags.push(
                    <li key={j}>
                        <span className="event-title">
                            Replied to issue <a href={ghe.payload.issue.html_url} className="no-dec">
                                <span className="event-issue-number">#{ghe.payload.issue.number}</span>
                            </a>
                        </span>
                        <div className="event-comment-container">
                            <Octicon icon={Comment} />
                            <span className="event-comment-body"><q>{ghe.payload.comment.body}</q></span>
                        </div>
                    </li>
                );
            }
            activityTags_comments.push(
                <li key={i}>
                    <a 
                    href="javascript:;" 
                    role="button" 
                    onClick={() => {document.querySelector(`#comments-repo-${repo.id}`).classList.toggle("hidden")}}
                    className="dropdown">
                        {repo.name}
                    </a>
                    <ul id={`comments-repo-${repo.id}`} className="hidden">
                        {commentTags}
                    </ul>
                </li>
            );
        }

        return (
            <div>
                <h1 className="section section-title">{this.props.title}</h1>
                <div className="section section-commits">
                    <Octicon icon={RepoPush} />
                    <span>
                        Created {commit_count} commits in {commit_uniqueRepos.length} {commit_uniqueRepos.length === 1 ? "repository" : "repositories"}
                    </span>
                    <ul>
                        {activityTags_commit}
                    </ul>
                </div>
                <div className="section section-creates">
                    <Octicon icon={Repo} />
                    <span>
                        Created {eventCreates.length} {eventCreates.length === 1 ? "repository" : "repositories"}
                    </span>
                    <ul>
                        {activityTags_create}
                    </ul>
                </div>
                <div className="section section-issues section-issues-opened">
                    <Octicon icon={IssueOpened} />
                    <span>
                        Opened {eventIssuesOpened.length} {eventIssuesOpened.length === 1 ? "issue" : "issues"} in {issue_openedUniqueRepos.length} {issue_openedUniqueRepos.length === 1 ? "repository" : "repositories"}
                    </span>
                    <ul>
                        {activityTags_issuesOpened}
                    </ul>
                </div>
                <div className="section section-issues section-issues-closed">
                    <Octicon icon={IssueClosed} />
                    <span>
                        Closed {eventIssuesClosed.length} {eventIssuesClosed.length === 1 ? "issue" : "issues"} in {issue_closedUniqueRepos.length} {issue_closedUniqueRepos.length === 1 ? "repository" : "repositories"}
                    </span>
                    <ul>
                        {activityTags_issuesClosed}
                    </ul>
                </div>
                <div className="section section-comments">
                    <Octicon icon={Comment} />
                    <span>
                        Wrote {eventComments.length} comments in {comment_uniqueRepos.length} {comment_uniqueRepos.length === 1 ? "repository" : "repositories"}
                    </span>
                    <ul>
                        {activityTags_comments}
                    </ul>
                </div>
            </div>
        );
    }
}

class GitHubContribs extends React.Component {
    
    constructor(props) {
        super();
        this.state = {
            githubEvents: [],
            githubRepos: []
        }
    }

    componentDidMount() {
        const gh = new Octokit({
            userAgent: 'tim-ings.com portfolio site'
        });

        // do not get rate limited by github while running in dev mode
        if (window.location.hostname === "localhost") {
            console.warn("USING SAMPLE DATA:", TestEventData);
            this.setState({
                githubEvents: TestEventData
            });
            return
        }

        // get all our activity
        gh.activity.listEventsForUser({
            username: ResumeData.contacts.github
        }).then((res) => {
            console.log("Got activity.listEventsForUser from github:", res);
            this.setState({
                githubEvents: res.data
            })
        }).catch((err) => {
            console.log("GitHub is rate limiting this IP address");
            this.setState({
                githubEvents: []
            })
        });
    }

    render() {
        if (this.state.githubEvents.length === 0) {
            return (
                <Container className="contrib-container">
                    <h1>GitHub Activity</h1>
                    <p>Unable to fetch data from GitHub at this time</p>
                </Container>
            )
        }

        let dateNow = new Date();
        let dateLastYear = dateNow.setYear(dateNow.getYear() - 1);
        let months = {};
        for (let i = 0; i < 12; i ++)
            months[i] = [];
        for (let i = 0; i < this.state.githubEvents.length; i++) {
            let eventDate = new Date(this.state.githubEvents[i].created_at);
            // only add events that occured within the last year
            if (eventDate > dateLastYear) {
                months[eventDate.getMonth()].push(this.state.githubEvents[i]);
            }
        }

        let monthNames = [
            "January",
            "Febuary",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        let year = new Date().getYear() + 1900;

        let monthTags = [];
        for (let k in months) {
            monthTags.push(
                <GitHubEventList 
                    key={k} 
                    events={months[k]} 
                    title={`${monthNames[k]} ${year}`} />
            );
        }

        return (
            <Container className="contrib-container">
                <h1>GitHub Activity</h1>
                {monthTags}
            </Container>
        )
    }
}

export default GitHubContribs;
