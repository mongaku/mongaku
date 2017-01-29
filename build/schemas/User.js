"use strict";

var bcrypt = require("bcrypt");

var models = require("../lib/models");
var db = require("../lib/db");

var User = new db.schema({
    // The email address of the user, must be unique
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    // The Bcrypt-hashed password
    hashedPassword: {
        type: String,
        required: true
    },

    // Hashed using the following salt
    salt: {
        type: String,
        required: true
    },

    // The sources to which the user is an administrator
    sourceAdmin: {
        type: [{
            type: String,
            ref: "Source"
        }]
    },

    // If this user is a site administrator
    // (can create new sources and other admins)
    siteAdmin: {
        type: Boolean,
        default: false
    }
});

User.virtual("password").set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
}).get(function () {
    return this._password;
});

User.path("email").validate(function (email, callback) {
    var User = models("User");

    // Check only when it is a new user or when email field is modified
    /* istanbul ignore else */
    if (this.isNew || this.isModified("email")) {
        User.findOne({ email: email }, function (err, user) {
            callback(!err && !user);
        });
    } else {
        /* istanbul ignore next */
        callback(true);
    }
}, "Email already exists");

User.methods = {
    authenticate: function authenticate(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },
    makeSalt: function makeSalt() {
        return bcrypt.genSaltSync(10);
    },
    encryptPassword: function encryptPassword(password) {
        if (!password) {
            return "";
        }

        try {
            return bcrypt.hashSync(password, this.salt);
        } catch (err) {
            /* istanbul ignore next */
            return "";
        }
    }
};

module.exports = User;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL1VzZXIuanMiXSwibmFtZXMiOlsiYmNyeXB0IiwicmVxdWlyZSIsIm1vZGVscyIsImRiIiwiVXNlciIsInNjaGVtYSIsImVtYWlsIiwidHlwZSIsIlN0cmluZyIsInJlcXVpcmVkIiwidW5pcXVlIiwiaW5kZXgiLCJoYXNoZWRQYXNzd29yZCIsInNhbHQiLCJzb3VyY2VBZG1pbiIsInJlZiIsInNpdGVBZG1pbiIsIkJvb2xlYW4iLCJkZWZhdWx0IiwidmlydHVhbCIsInNldCIsInBhc3N3b3JkIiwiX3Bhc3N3b3JkIiwibWFrZVNhbHQiLCJlbmNyeXB0UGFzc3dvcmQiLCJnZXQiLCJwYXRoIiwidmFsaWRhdGUiLCJjYWxsYmFjayIsImlzTmV3IiwiaXNNb2RpZmllZCIsImZpbmRPbmUiLCJlcnIiLCJ1c2VyIiwibWV0aG9kcyIsImF1dGhlbnRpY2F0ZSIsInBsYWluVGV4dCIsImdlblNhbHRTeW5jIiwiaGFzaFN5bmMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFNBQVNDLFFBQVEsUUFBUixDQUFmOztBQUVBLElBQU1DLFNBQVNELFFBQVEsZUFBUixDQUFmO0FBQ0EsSUFBTUUsS0FBS0YsUUFBUSxXQUFSLENBQVg7O0FBRUEsSUFBTUcsT0FBTyxJQUFJRCxHQUFHRSxNQUFQLENBQWM7QUFDdkI7QUFDQUMsV0FBTztBQUNIQyxjQUFNQyxNQURIO0FBRUhDLGtCQUFVLElBRlA7QUFHSEMsZ0JBQVEsSUFITDtBQUlIQyxlQUFPO0FBSkosS0FGZ0I7O0FBU3ZCO0FBQ0FDLG9CQUFnQjtBQUNaTCxjQUFNQyxNQURNO0FBRVpDLGtCQUFVO0FBRkUsS0FWTzs7QUFldkI7QUFDQUksVUFBTTtBQUNGTixjQUFNQyxNQURKO0FBRUZDLGtCQUFVO0FBRlIsS0FoQmlCOztBQXFCdkI7QUFDQUssaUJBQWE7QUFDVFAsY0FBTSxDQUFDO0FBQ0hBLGtCQUFNQyxNQURIO0FBRUhPLGlCQUFLO0FBRkYsU0FBRDtBQURHLEtBdEJVOztBQTZCdkI7QUFDQTtBQUNBQyxlQUFXO0FBQ1BULGNBQU1VLE9BREM7QUFFUEMsaUJBQVM7QUFGRjtBQS9CWSxDQUFkLENBQWI7O0FBcUNBZCxLQUNLZSxPQURMLENBQ2EsVUFEYixFQUVLQyxHQUZMLENBRVMsVUFBU0MsUUFBVCxFQUFtQjtBQUNwQixTQUFLQyxTQUFMLEdBQWlCRCxRQUFqQjtBQUNBLFNBQUtSLElBQUwsR0FBWSxLQUFLVSxRQUFMLEVBQVo7QUFDQSxTQUFLWCxjQUFMLEdBQXNCLEtBQUtZLGVBQUwsQ0FBcUJILFFBQXJCLENBQXRCO0FBQ0gsQ0FOTCxFQU9LSSxHQVBMLENBT1MsWUFBVztBQUNaLFdBQU8sS0FBS0gsU0FBWjtBQUNILENBVEw7O0FBV0FsQixLQUFLc0IsSUFBTCxDQUFVLE9BQVYsRUFBbUJDLFFBQW5CLENBQTRCLFVBQVNyQixLQUFULEVBQWdCc0IsUUFBaEIsRUFBMEI7QUFDbEQsUUFBTXhCLE9BQU9GLE9BQU8sTUFBUCxDQUFiOztBQUVBO0FBQ0E7QUFDQSxRQUFJLEtBQUsyQixLQUFMLElBQWMsS0FBS0MsVUFBTCxDQUFnQixPQUFoQixDQUFsQixFQUE0QztBQUN4QzFCLGFBQUsyQixPQUFMLENBQWEsRUFBQ3pCLE9BQU9BLEtBQVIsRUFBYixFQUE2QixVQUFDMEIsR0FBRCxFQUFNQyxJQUFOLEVBQWU7QUFDeENMLHFCQUFTLENBQUNJLEdBQUQsSUFBUSxDQUFDQyxJQUFsQjtBQUNILFNBRkQ7QUFJSCxLQUxELE1BS087QUFDSDtBQUNBTCxpQkFBUyxJQUFUO0FBQ0g7QUFDSixDQWRELEVBY0csc0JBZEg7O0FBZ0JBeEIsS0FBSzhCLE9BQUwsR0FBZTtBQUNYQyxnQkFEVyx3QkFDRUMsU0FERixFQUNhO0FBQ3BCLGVBQU8sS0FBS1osZUFBTCxDQUFxQlksU0FBckIsTUFBb0MsS0FBS3hCLGNBQWhEO0FBQ0gsS0FIVTtBQUtYVyxZQUxXLHNCQUtBO0FBQ1AsZUFBT3ZCLE9BQU9xQyxXQUFQLENBQW1CLEVBQW5CLENBQVA7QUFDSCxLQVBVO0FBU1hiLG1CQVRXLDJCQVNLSCxRQVRMLEVBU2U7QUFDdEIsWUFBSSxDQUFDQSxRQUFMLEVBQWU7QUFDWCxtQkFBTyxFQUFQO0FBQ0g7O0FBRUQsWUFBSTtBQUNBLG1CQUFPckIsT0FBT3NDLFFBQVAsQ0FBZ0JqQixRQUFoQixFQUEwQixLQUFLUixJQUEvQixDQUFQO0FBQ0gsU0FGRCxDQUVFLE9BQU9tQixHQUFQLEVBQVk7QUFDVjtBQUNBLG1CQUFPLEVBQVA7QUFDSDtBQUNKO0FBcEJVLENBQWY7O0FBdUJBTyxPQUFPQyxPQUFQLEdBQWlCcEMsSUFBakIiLCJmaWxlIjoiVXNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGJjcnlwdCA9IHJlcXVpcmUoXCJiY3J5cHRcIik7XG5cbmNvbnN0IG1vZGVscyA9IHJlcXVpcmUoXCIuLi9saWIvbW9kZWxzXCIpO1xuY29uc3QgZGIgPSByZXF1aXJlKFwiLi4vbGliL2RiXCIpO1xuXG5jb25zdCBVc2VyID0gbmV3IGRiLnNjaGVtYSh7XG4gICAgLy8gVGhlIGVtYWlsIGFkZHJlc3Mgb2YgdGhlIHVzZXIsIG11c3QgYmUgdW5pcXVlXG4gICAgZW1haWw6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgdW5pcXVlOiB0cnVlLFxuICAgICAgICBpbmRleDogdHJ1ZSxcbiAgICB9LFxuXG4gICAgLy8gVGhlIEJjcnlwdC1oYXNoZWQgcGFzc3dvcmRcbiAgICBoYXNoZWRQYXNzd29yZDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIH0sXG5cbiAgICAvLyBIYXNoZWQgdXNpbmcgdGhlIGZvbGxvd2luZyBzYWx0XG4gICAgc2FsdDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIH0sXG5cbiAgICAvLyBUaGUgc291cmNlcyB0byB3aGljaCB0aGUgdXNlciBpcyBhbiBhZG1pbmlzdHJhdG9yXG4gICAgc291cmNlQWRtaW46IHtcbiAgICAgICAgdHlwZTogW3tcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHJlZjogXCJTb3VyY2VcIixcbiAgICAgICAgfV0sXG4gICAgfSxcblxuICAgIC8vIElmIHRoaXMgdXNlciBpcyBhIHNpdGUgYWRtaW5pc3RyYXRvclxuICAgIC8vIChjYW4gY3JlYXRlIG5ldyBzb3VyY2VzIGFuZCBvdGhlciBhZG1pbnMpXG4gICAgc2l0ZUFkbWluOiB7XG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG59KTtcblxuVXNlclxuICAgIC52aXJ0dWFsKFwicGFzc3dvcmRcIilcbiAgICAuc2V0KGZ1bmN0aW9uKHBhc3N3b3JkKSB7XG4gICAgICAgIHRoaXMuX3Bhc3N3b3JkID0gcGFzc3dvcmQ7XG4gICAgICAgIHRoaXMuc2FsdCA9IHRoaXMubWFrZVNhbHQoKTtcbiAgICAgICAgdGhpcy5oYXNoZWRQYXNzd29yZCA9IHRoaXMuZW5jcnlwdFBhc3N3b3JkKHBhc3N3b3JkKTtcbiAgICB9KVxuICAgIC5nZXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXNzd29yZDtcbiAgICB9KTtcblxuVXNlci5wYXRoKFwiZW1haWxcIikudmFsaWRhdGUoZnVuY3Rpb24oZW1haWwsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgVXNlciA9IG1vZGVscyhcIlVzZXJcIik7XG5cbiAgICAvLyBDaGVjayBvbmx5IHdoZW4gaXQgaXMgYSBuZXcgdXNlciBvciB3aGVuIGVtYWlsIGZpZWxkIGlzIG1vZGlmaWVkXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAodGhpcy5pc05ldyB8fCB0aGlzLmlzTW9kaWZpZWQoXCJlbWFpbFwiKSkge1xuICAgICAgICBVc2VyLmZpbmRPbmUoe2VtYWlsOiBlbWFpbH0sIChlcnIsIHVzZXIpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCFlcnIgJiYgIXVzZXIpO1xuICAgICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIGNhbGxiYWNrKHRydWUpO1xuICAgIH1cbn0sIFwiRW1haWwgYWxyZWFkeSBleGlzdHNcIik7XG5cblVzZXIubWV0aG9kcyA9IHtcbiAgICBhdXRoZW50aWNhdGUocGxhaW5UZXh0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuY3J5cHRQYXNzd29yZChwbGFpblRleHQpID09PSB0aGlzLmhhc2hlZFBhc3N3b3JkO1xuICAgIH0sXG5cbiAgICBtYWtlU2FsdCgpIHtcbiAgICAgICAgcmV0dXJuIGJjcnlwdC5nZW5TYWx0U3luYygxMCk7XG4gICAgfSxcblxuICAgIGVuY3J5cHRQYXNzd29yZChwYXNzd29yZCkge1xuICAgICAgICBpZiAoIXBhc3N3b3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gYmNyeXB0Lmhhc2hTeW5jKHBhc3N3b3JkLCB0aGlzLnNhbHQpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXI7XG4iXX0=