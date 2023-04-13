import React from 'react';
import { connect } from 'react-redux';
import { getFanAPI } from '../controller/redux';


class SdhHinhThucConfig {
    state = {};
    componentDidMount() {
    }
    handeChange(value, item) {
        if (value) {
            console.log(value, item);
        }
    }
    render() {
        return this.props.getFanAPT;

    }
}

const mapStateToProps = state => ({ system: state.system });
const mapActionsToProps = { getFanAPI };
export default connect(mapStateToProps, mapActionsToProps, null, { forwardRef: true })(SdhHinhThucConfig);
