"use strict";

const React = require("react");

const metadata = require("../lib/metadata");
const options = require("../lib/options");

const Page = require("./Page.jsx");

const CreateRecord = React.createClass({
    propTypes: {
        gettext: React.PropTypes.func.isRequired,
        lang: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
    },

    getTitle() {
        return this.props.gettext("Create Record");
    },

    renderForm() {
        return <div className="col-md-12 imageholder">
            <form action="" method="POST">
                <div className="responsive-table">
                    <table className="table table-hover">
                        <thead>
                            <tr className="plain">
                                <th/>
                                <th className="col-xs-12 text-center">
                                    <h1 className="panel-title">
                                        {this.getTitle()}
                                    </h1>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderImageForm()}
                            {this.renderIDForm()}
                            {this.renderMetadata()}
                            {this.renderSubmitButton()}
                        </tbody>
                    </table>
                </div>
            </form>
        </div>;
    },

    renderImageForm() {
        if (options.types[this.props.type].noImages) {
            return null;
        }

        return <tr>
            <th className="text-right">
                {this.props.gettext("Images")}
            </th>
            <td>
                <input
                    type="file"
                    name="images"
                    className="form-control"
                    multiple
                />
            </td>
        </tr>;
    },

    renderIDForm() {
        return <tr>
            <th className="text-right">
                {this.props.gettext("ID")}
            </th>
            <td>
                <input type="text" name="id" className="form-control"/>
            </td>
        </tr>;
    },

    renderMetadata() {
        const type = this.props.type;
        const model = metadata.model(type);

        return options.types[type].display.map((type) => {
            const typeSchema = model[type];

            return <tr key={type}>
                <th className="text-right">
                    {typeSchema.options.title(this.props)}
                </th>
                <td>
                    {typeSchema.renderEdit(null, this.props)}
                </td>
            </tr>;
        });
    },

    renderSubmitButton() {
        return <tr>
            <th/>
            <td>
                <input
                    type="submit"
                    value={this.props.gettext("Create")}
                    className="btn btn-primary"
                />
            </td>
        </tr>;
    },

    render() {
        return <Page
            {...this.props}
            title={this.getTitle()}
        >
            <div className="row">
                {this.renderForm()}
            </div>
        </Page>;
    },
});

module.exports = CreateRecord;
