import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class School extends React.Component {
    
    constructor(props) {
        super();
    }

    render() {
        let awards = [];
        for (let i = 0; i < this.props.data.awards.length; i++) {
            let awd = this.props.data.awards[i];
            awards.push(
                <li key={i} className="course-work-item">
                    {awd.title}
                </li>
            );
        }

        let awardsJsx = null;
        if (this.props.data.awards.length > 0) {
            awardsJsx = (
                <>
                <p>Awards:</p>
                <ul className="course-work-list">
                    {awards}
                </ul>
                <br />
                </>
            );
        }

        let courseWork = [];
        for (let i = 0; i < this.props.data.coursework.length; i++) {
            let cw = this.props.data.coursework[i];
            courseWork.push(
                <li key={i} className="course-work-itme">
                    {cw.title}
                    <span className="course-code">{cw.code}</span>
                </li>
            );
        }

        let courseWorkJsx = (
            <>
            <p>Coursework:</p>
            <ul className="course-work-list">
                {courseWork}
            </ul>
            </>
        );

        let tags = new Set();
        // gather all tags
        for (let i = 0; i < this.props.data.coursework.length; i++) {
            for (let j = 0; j < this.props.data.coursework[i].tags.length; j++) {
                tags.add(this.props.data.coursework[i].tags[j]);
            }
        }
        tags = Array.from(tags);
        let techTags = [];
        for (let i = 0; i < tags.length; i++) {
            techTags.push(
                <span key={i} className="tech-tag tech-tag-light">
                    <span className={`tech-tag-icon tech-tag-${tags[i].toLowerCase().replace(/\s/g, '')}`}></span>
                    {tags[i]}
                </span>);
        }

        let dateLine = `${this.props.data.start} - ${this.props.data.end}`;
        if (this.props.data.end === "") {
            dateLine = `${this.props.data.start}`;
        }

        return (
            <Container className="school">
                <Row>
                    <Col>
                        <h1 className="school-name">{this.props.data.name}</h1>
                    </Col>
                    <Col>
                        <h1 className="school-dates">{dateLine}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1 className="school-major">{this.props.data.major1}</h1>
                    </Col>
                    <Col>
                        <h1 className="school-location">{this.props.data.location}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1 className="school-major">{this.props.data.major2}</h1>
                    </Col>
                    <Col></Col>
                </Row>
                <br />
                {awardsJsx}
                {courseWorkJsx}
                {techTags}
            </Container>
        )
    }
}

export default School;
