import React from 'react';
import Project from '../components/Project.js';
import projects from '../data/projects.json';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Header from '../components/Header.js'

class Portfolio extends React.Component {
    
    constructor(props) {
        super();
        this.state = {
            tabKey: "websites"
        };
        this.tabCategories = [
            "Websites",
            "Programs",
            "Games",
            "AddOns"
        ]
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(key) {
        this.setState({ tabKey: key });
    }

    render() {
        const proj_websites = [];
        const proj_programs = [];
        const proj_games = [];
        const proj_addons = [];
        for (let i = 0; i < projects.length; i++) {
            let proj = (<Project key={i} data={projects[i]} />);
            switch(projects[i].category) {
                case "website": proj_websites.push(proj); break;
                case "program": proj_programs.push(proj); break;
                case "game": proj_games.push(proj); break;
                case "wow-addon": proj_addons.push(proj); break;
                default: proj_programs.push(proj); break;
            }
        }

        return (
            <>
            <Header></Header>
            <Tabs defaultActiveKey="websites" id="uncontrolled-tab-example">
                <Tab eventKey="websites" title="Websites">
                    {proj_websites}
                </Tab>
                <Tab eventKey="programs" title="Programs">
                    {proj_programs}
                </Tab>
                <Tab eventKey="games" title="Games">
                    {proj_games}
                </Tab>
                <Tab eventKey="addons" title="AddOns">
                    {proj_addons}
                </Tab>
            </Tabs>
            </>
        )
    }
}

export default Portfolio;
