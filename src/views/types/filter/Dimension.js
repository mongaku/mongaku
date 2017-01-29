const React = require("react");

const DimensionFilter = React.createClass({
    propTypes: {
        heightTitle: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.shape({
            max: React.PropTypes.number,
            min: React.PropTypes.number,
        }),
        searchName: React.PropTypes.string,
        value: React.PropTypes.shape({
            heightMin: React.PropTypes.number,
            heightMax: React.PropTypes.number,
            widthMax: React.PropTypes.number,
            widthMin: React.PropTypes.number,
        }),
        widthTitle: React.PropTypes.string.isRequired,
    },

    getDefaultProps() {
        return {
            placeholder: {},
            value: {},
        };
    },

    render() {
        const searchName = this.props.searchName || this.props.name;

        return <div className="row">
            <div className="form-group col-xs-6 col-sm-12 col-lg-6">
                <label htmlFor={`${searchName}.widthMin`}
                    className="control-label"
                >
                    {this.props.widthTitle}
                </label>
                <div className="form-inline">
                    <input type="text" name={`${searchName}.widthMin`}
                        defaultValue={this.props.value.widthMin}
                        placeholder={this.props.placeholder.min}
                        className="form-control size-control"
                    />
                    &mdash;
                    <input type="text" name={`${searchName}.widthMax`}
                        defaultValue={this.props.value.widthMax}
                        placeholder={this.props.placeholder.max}
                        className="form-control size-control"
                    />
                </div>
            </div>
            <div className="form-group col-xs-6 col-sm-12 col-lg-6">
                <label htmlFor={`${searchName}.heightMin`}
                    className="control-label"
                >
                    {this.props.heightTitle}
                </label>
                <div className="form-inline">
                    <input type="text" name={`${searchName}.heightMin`}
                        defaultValue={this.props.value.heightMin}
                        placeholder={this.props.placeholder.min}
                        className="form-control size-control"
                    />
                    &mdash;
                    <input type="text" name={`${searchName}.heightMax`}
                        defaultValue={this.props.value.heightMax}
                        placeholder={this.props.placeholder.max}
                        className="form-control size-control"
                    />
                </div>
            </div>
        </div>;
    },
});

module.exports = DimensionFilter;
