/*
Author: Chris Kirby
Email: dev@chriskirby.me
Last Update: 07/15/24


parse (Vector.mjs:5:5-45:6): Parses arguments to create a new Vector2D instance or Float32Array.
lerp: Performs linear interpolation between two vectors.
constructor: Constructs a new Vector2D instance with provided arguments and options.
set: Sets the coordinates of the vector based on the provided arguments.
add: Adds values to the x and y coordinates of the vector.
subtract: Subtracts values from the x and y coordinates of the vector.
lerpTo: Linearly interpolates the vector coordinates towards target values.
save: Saves the current vector state and updates history based on options.
dirty: Checks if the current vector state is different from the saved state.
hasValue: Checks if any of the coordinates are not zero.
copy: Creates a copy of the current Vector2D instance.
opposite: Returns a new Vector2D instance with opposite values.
max: Sets the maximum values of the vector.
min: Sets the minimum values of the vector.
clamp: Clamps the vector coordinates between specified minimum and maximum values.
limited: Returns a new Vector2D instance with coordinates clamped between minimum and maximum values.
*/

export class Vector2D {
    /**
     * Parses arguments and returns a Float32Array containing XY coordinates.
     *
     * @param {number|Array|Vector2D} arg1 - Argument to parse.
     * @param {number} [arg2] - Second argument to parse (optional).
     * @returns {Float32Array} A Float32Array containing XY coordinates.
     * @throws {TypeError} If argument is invalid.
     */
    static parse(arg1, arg2) {
        const coords = new Float32Array(2);

        // If second argument is provided, directly assign XY coordinates
        if (arg2 !== undefined) {
            coords[0] = arg1;
            coords[1] = arg2;
            return coords;
        }

        // If first argument is provided, assign XY values from array or Vector2D object
        if (arg1 !== undefined) {
            if (Array.isArray(arg1)) {
                // Argument is an XY array
                if (arg1.length === 2) {
                    coords[0] = arg1[0];
                    coords[1] = arg1[1];
                    return coords;
                } else {
                    throw new TypeError("Array must be of length 2");
                }
            } else if (arg1 instanceof Vector2D) {
                // Argument is another Vector2D object
                coords[0] = arg1.coords[0];
                coords[1] = arg1.coords[1];
                return coords;
            } else {
                throw new TypeError("Argument must be an array or Vector2D object");
            }
        } else {
            throw new TypeError("Must provide an argument");
        }
    }

    /**
     * Performs linear interpolation between two vectors.
     *
     * @param {Object} v1 - The first vector.
     * @param {Object} v2 - The second vector.
     * @param {number} amt - The interpolation amount.
     * @return {Vector2D} The interpolated vector.
     */
    static lerp(v1, v2, amt) {
        return new Vector2D(lerp(v1.coords[0], v2.coords[0], amt), lerp(v1.coords[1], v2.coords[1], amt));
    }

    /**
     * Constructs a new instance of the Vector2D class.
     *
     * @param {number|Array|Vector2D} arg1 - The first argument to parse.
     * @param {number} [arg2] - The second argument to parse (optional).
     * @param {Object} [options={}] - The options for the vector.
     */
    constructor(arg1, arg2, options = {}) {
        this.options = options;
        this.coords = new Float32Array(2);
        this.set(arg1, arg2);
        this.save();
    }

    /**
     * Sets the coordinates of the vector based on the provided arguments.
     *
     * @param {number|Array|Vector2D} arg1 - The first argument to parse.
     * @param {number} arg2 - The second argument to parse.
     */
    set(arg1, arg2) {
        this.coords = Vector2D.parse(arg1, arg2);
    }

    /**
     * Adds the given values to the x and y coordinates of the vector.
     *
     * @param {number} x - The value to add to the x coordinate.
     * @param {number} y - The value to add to the y coordinate.
     * @return {void} This function does not return a value.
     */
    add(x, y) {
        this.coords[0] += x;
        this.coords[1] += y;
    }

    /**
     * Subtracts the given values from the x and y coordinates of the vector.
     *
     * @param {number} x - The value to subtract from the x coordinate.
     * @param {number} y - The value to subtract from the y coordinate.
     */
    subtract(x, y) {
        this.coords[0] -= x;
        this.coords[1] -= y;
    }

    /**
     * Linearly interpolates the vector coordinates to the target x and y values by a certain amount.
     *
     * @param {number} x - The target x value to interpolate towards.
     * @param {number} y - The target y value to interpolate towards.
     * @param {number} amt - The amount of interpolation to apply.
     */
    lerpTo(x, y, amt) {
        this.coords[0] = lerp(this.coords[0], x, amt);
        this.coords[1] = lerp(this.coords[1], y, amt);
    }

    get x() {
        return this.coords[0];
    }

    get y() {
        return this.coords[1];
    }

    set x(x) {
        this.coords[0] = x;
    }

    set y(y) {
        this.coords[1] = y;
    }

    /**
     * Saves the current vector state by creating a copy and updating the history based on options.
     */
    save() {
        this.saved = this.coords.slice();
        if (this.options.history && this.options.history > 0) {
            this.history.unshift(this.saved);
            if (this.history.length > this.options.history) this.history.pop();
        }
    }

    /**
     * Checks if the current vector state is different from the saved state.
     *
     * @return {boolean} Returns true if the current vector state is different from the saved state, false otherwise.
     */
    get dirty() {
        return this.coords[0] !== this.saved[0] || this.coords[1] !== this.saved[1];
    }

    /**
     * Checks if any of the x, y, or z coordinates of the vector are not equal to zero.
     *
     * @return {boolean} Returns true if any of the coordinates are not zero, false otherwise.
     */
    hasValue() {
        return this.coords[0] !== 0 || this.coords[1] !== 0 || this.coords[2] !== 0;
    }

    /**
     * Creates a copy of the current Vector2D instance.
     *
     * @return {Vector2D} A new Vector2D instance that is a copy of the current vector.
     */
    copy() {
        return new Vector2D(this);
    }
    /**
     * Returns a new Vector2D instance with the opposite values of the current instance.
     *
     * @return {Vector2D} A new Vector2D instance with the opposite values of the current instance.
     */
    opposite() {
        return new Vector2D(-this.coords[0], -this.coords[1]);
    }

    /**
     * Sets the maximum values of the vector to the given x and y coordinates.
     *
     * @param {number} x - The maximum x-coordinate.
     * @param {number} y - The maximum y-coordinate.
     * @return {void}
     */
    max(x, y) {
        this._max = new Vector2D(x, y);
    }

    /**
     * Sets the minimum values of the vector to the given x and y coordinates.
     *
     * @param {number} x - The minimum x-coordinate.
     * @param {number} y - The minimum y-coordinate.
     * @return {void}
     */
    min(x, y) {
        this._min = new Vector2D(x, y);
    }

    /**
     * Clamps the coordinates of the vector within the specified minimum and maximum values.
     *
     * @return {void}
     */
    clamp() {
        this.coords[0] = clamp(this.coords[0], this._min.x, this._max.x);
        this.coords[1] = clamp(this.coords[1], this._min.y, this._max.y);
    }

    /**
     * Returns a new Vector2D with coordinates clamped between the minimum and maximum values.
     *
     * @return {Vector2D} A new Vector2D instance with clamped coordinates.
     */
    limited() {
        return new Vector2D(
            Math.max(this.min.x, Math.min(this.max.x, this.coords[0])),
            Math.max(this.min.y, Math.min(this.max.y, this.coords[1]))
        );
    }
}
