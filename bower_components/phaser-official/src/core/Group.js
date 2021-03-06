/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Group is a container for {@link DisplayObject display objects} including {@link Phaser.Sprite Sprites} and {@link Phaser.Image Images}.
*
* Groups form the logical tree structure of the display/scene graph where local transformations are applied to children.
* For instance, all children are also moved/rotated/scaled when the group is moved/rotated/scaled.
*
* In addition, Groups provides support for fast pooling and object recycling.
*
* Groups are also display objects and can be nested as children within other Groups.
*
* @class Phaser.Group
* @extends PIXI.DisplayObjectContainer
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {DisplayObject|null} [parent=(game world)] - The parent Group (or other {@link DisplayObject}) that this group will be added to.
*     If undefined/unspecified the Group will be added to the {@link Phaser.Game#world Game World}; if null the Group will not be added to any parent.
* @param {string} [name='group'] - A name for this group. Not used internally but useful for debugging.
* @param {boolean} [addToStage=false] - If true this group will be added directly to the Game.Stage instead of Game.World.
* @param {boolean} [enableBody=false] - If true all Sprites created with {@link #create} or {@link #createMulitple} will have a physics body created on them. Change the body type with {@link #physicsBodyType}.
* @param {integer} [physicsBodyType=0] - The physics body type to use when physics bodies are automatically added. See {@link #physicsBodyType} for values.
*/
Phaser.Group = function (game, parent, name, addToStage, enableBody, physicsBodyType) {

    if (typeof addToStage === 'undefined') { addToStage = false; }
    if (typeof enableBody === 'undefined') { enableBody = false; }
    if (typeof physicsBodyType === 'undefined') { physicsBodyType = Phaser.Physics.ARCADE; }

    /**
    * A reference to the currently running Game.
    * @property {Phaser.Game} game
    * @protected
    */
    this.game = game;

    if (typeof parent === 'undefined')
    {
        parent = game.world;
    }

    /**
    * A name for this group. Not used internally but useful for debugging.
    * @property {string} name
    */
    this.name = name || 'group';

    /**
    * The z-depth value of this object within its parent container/Group - the World is a Group as well.
    * This value must be unique for each child in a Group.
    * @property {integer} z
    */
    this.z = 0;

    PIXI.DisplayObjectContainer.call(this);

    if (addToStage)
    {
        this.game.stage.addChild(this);
        this.z = this.game.stage.children.length;
    }
    else
    {
        if (parent)
        {
            parent.addChild(this);
            this.z = parent.children.length;
        }
    }

    /**
    * Internal Phaser Type value.
    * @property {integer} type
    * @protected
    */
    this.type = Phaser.GROUP;

    /**
    * @property {number} physicsType - The const physics body type of this object.
    * @readonly
    */
    this.physicsType = Phaser.GROUP;

    /**
    * The alive property is useful for Groups that are children of other Groups and need to be included/excluded in checks like forEachAlive.
    * @property {boolean} alive
    * @default
    */
    this.alive = true;

    /**
    * If exists is true the group is updated, otherwise it is skipped.
    * @property {boolean} exists
    * @default
    */
    this.exists = true;

    /**
    * A group with `ignoreDestroy` set to `true` ignores all calls to its `destroy` method.
    * @property {boolean} ignoreDestroy
    * @default
    */
    this.ignoreDestroy = false;

    /**
    * The type of objects that will be created when using {@link #create} or {@link #createMultiple}.
    *
    * Any object may be used but it should extend either Sprite or Image and accept the same constructor arguments:
    * when a new object is created it is passed the following parameters to its constructor: `(game, x, y, key, frame)`.
    *
    * @property {object} classType
    * @default {@link Phaser.Sprite}
    */
    this.classType = Phaser.Sprite;

    /**
    * The scale of the group container.
    *
    * @property {Phaser.Point} scale
    */
    this.scale = new Phaser.Point(1, 1);

    /**
    * The current display object that the group cursor is pointing to, if any. (Can be set manually.)
    *
    * The cursor is a way to iterate through the children in a Group using {@link #next} and {@link #previous}.
    * @property {?DisplayObject} cursor
    */
    this.cursor = null;

    /**
    * If true all Sprites created by, or added to this group, will have a physics body enabled on them.
    *
    * The default body type is controlled with {@link #physicsBodyType}.
    * @property {boolean} enableBody
    */
    this.enableBody = enableBody;

    /**
    * If true when a physics body is created (via {@link #enableBody}) it will create a physics debug object as well.
    *
    * This only works for P2 bodies.
    * @property {boolean} enableBodyDebug
    * @default
    */
    this.enableBodyDebug = false;

    /**
    * If {@link #enableBody} is true this is the type of physics body that is created on new Sprites.
    *
    * The valid values are {@link Phaser.Physics.ARCADE}, {@link Phaser.Physics.P2}, {@link Phaser.Physics.NINJA}, etc.
    * @property {integer} physicsBodyType
    */
    this.physicsBodyType = physicsBodyType;

    /**
    * This signal is dispatched when the group is destroyed.
    * @property {Phaser.Signal} onDestroy
    */
    this.onDestroy = new Phaser.Signal();

    /**
    * @property {integer} cursorIndex - The current index of the Group cursor. Advance it with Group.next.
    * @readOnly
    */
    this.cursorIndex = 0;

    /**
    * A Group that is fixed to the camera uses its x/y coordinates as offsets from the top left of the camera. These are stored in Group.cameraOffset.
    *
    * Note that the cameraOffset values are in addition to any parent in the display list.
    * So if this Group was in a Group that has x: 200, then this will be added to the cameraOffset.x
    *
    * @property {boolean} fixedToCamera
    */
    this.fixedToCamera = false;

    /**
    * If this object is {@link #fixedToCamera} then this stores the x/y position offset relative to the top-left of the camera view.
    * If the parent of this Group is also `fixedToCamera` then the offset here is in addition to that and should typically be disabled.
    * @property {Phaser.Point} cameraOffset
    */
    this.cameraOffset = new Phaser.Point();

    /**
    * An internal array used by physics for fast non z-index destructive sorting.
    * @property {array} _hash
    * @private
    */
    this._hash = [];

    /**
    * The property on which children are sorted.
    * @property {string} _sortProperty
    * @private
    */
    this._sortProperty = 'z';

};

Phaser.Group.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
Phaser.Group.prototype.constructor = Phaser.Group;

/**
* A returnType value, as specified in {@link #iterate} eg.
* @constant
* @type {integer}
*/
Phaser.Group.RETURN_NONE = 0;

/**
* A returnType value, as specified in {@link #iterate} eg.
* @constant
* @type {integer}
*/
Phaser.Group.RETURN_TOTAL = 1;

/**
* A returnType value, as specified in {@link #iterate} eg.
* @constant
* @type {integer}
*/
Phaser.Group.RETURN_CHILD = 2;

/**
* A sort ordering value, as specified in {@link #sort} eg.
* @constant
* @type {integer}
*/
Phaser.Group.SORT_ASCENDING = -1;

/**
* A sort ordering value, as specified in {@link #sort} eg.
* @constant
* @type {integer}
*/
Phaser.Group.SORT_DESCENDING = 1;

/**
* Adds an existing object as the top child in this group.
*
* The child is automatically added to the top of the group and is displayed on top of every previous child.
*
* Use {@link #addAt} to control where a child is added. Use {@link #create} to create and add a new child.
*
* @method Phaser.Group#add
* @param {DisplayObject} child - The display object to add as a child.
* @param {boolean} [silent=false] - If true the child will not dispatch the `onAddedToGroup` event.
* @return {DisplayObject} The child that was added to the group.
*/
Phaser.Group.prototype.add = function (child, silent) {

    if (typeof silent === 'undefined') { silent = false; }

    if (child.parent !== this)
    {
        if (this.enableBody)
        {
            this.game.physics.enable(child, this.physicsBodyType);
        }

        this.addChild(child);

        this._hash.push(child);

        child.z = this.children.length;

        if (!silent && child.events)
        {
            child.events.onAddedToGroup$dispatch(child, this);
        }

        if (this.cursor === null)
        {
            this.cursor = child;
        }
    }

    return child;

};

/**
* Adds an array of existing display objects to this group.
*
* The children are automatically added to the top of the group, so render on-top of everything else within the group.
*
* TODO: Add ability to pass the children as parameters rather than having to be an array.
*
* @method Phaser.Group#addMultiple
* @param {DisplayObject[]} children - An array of display objects to add as children.
* @param {boolean} [silent=false] - If true the children will not dispatch the `onAddedToGroup` event.
* @return {DisplayObject[]} The array of children that were added to the group.
*/
Phaser.Group.prototype.addMultiple = function (children, silent) {

    if (Array.isArray(children))
    {
        for (var i = 0; i < children.length; i++)
        {
            this.add(children[i], silent);
        }
    }

    return children;

};

/**
* Adds an existing object to this group.
*
* The child is added to the group at the location specified by the index value, this allows you to control child ordering.
*
* @method Phaser.Group#addAt
* @param {DisplayObject} child - The display object to add as a child.
* @param {integer} [index=0] - The index within the group to insert the child to.
* @param {boolean} [silent=false] - If true the child will not dispatch the `onAddedToGroup` event.
* @return {DisplayObject} The child that was added to the group.
*/
Phaser.Group.prototype.addAt = function (child, index, silent) {

    if (typeof silent === 'undefined') { silent = false; }

    if (child.parent !== this)
    {
        if (this.enableBody)
        {
            this.game.physics.enable(child, this.physicsBodyType);
        }

        this.addChildAt(child, index);

        this._hash.push(child);

        this.updateZ();

        if (!silent && child.events)
        {
            child.events.onAddedToGroup$dispatch(child, this);
        }

        if (this.cursor === null)
        {
            this.cursor = child;
        }
    }

    return child;

};

/**
* Returns the child found at the given index within this group.
*
* @method Phaser.Group#getAt
* @param {integer} index - The index to return the child from.
* @return {DisplayObject} The child that was found at the given index, or -1 for an invalid index.
*/
Phaser.Group.prototype.getAt = function (index) {

    if (index < 0 || index >= this.children.length)
    {
        return -1;
    }
    else
    {
        return this.getChildAt(index);
    }

};

/**
* Creates a new Phaser.Sprite object and adds it to the top of this group.
*
* Use {@link #classType} to change the type of object creaded.
*
* @method Phaser.Group#create
* @param {number} x - The x coordinate to display the newly created Sprite at. The value is in relation to the group.x point.
* @param {number} y - The y coordinate to display the newly created Sprite at. The value is in relation to the group.y point.
* @param {string} key - The Game.cache key of the image that this Sprite will use.
* @param {integer|string} [frame] - If the Sprite image contains multiple frames you can specify which one to use here.
* @param {boolean} [exists=true] - The default exists state of the Sprite.
* @return {DisplayObject} The child that was created: will be a {@link Phaser.Sprite} unless {@link #classType} has been changed.
*/
Phaser.Group.prototype.create = function (x, y, key, frame, exists) {

    if (typeof exists === 'undefined') { exists = true; }

    var child = new this.classType(this.game, x, y, key, frame);

    if (this.enableBody)
    {
        this.game.physics.enable(child, this.physicsBodyType, this.enableBodyDebug);
    }

    child.exists = exists;
    child.visible = exists;
    child.alive = exists;

    this.addChild(child);

    this._hash.push(child);

    child.z = this.children.length;

    if (child.events)
    {
        child.events.onAddedToGroup$dispatch(child, this);
    }

    if (this.cursor === null)
    {
        this.cursor = child;
    }

    return child;

};

/**
* Creates multiple Phaser.Sprite objects and adds them to the top of this group.
*
* Useful if you need to quickly generate a pool of identical sprites, such as bulletGrp.
*
* By default the sprites will be set to not exist and will be positioned at 0, 0 (relative to the group.x/y).
* Use {@link #classType} to change the type of object creaded.
*
* @method Phaser.Group#createMultiple
* @param {integer} quantity - The number of Sprites to create.
* @param {string} key - The Game.cache key of the image that this Sprite will use.
* @param {integer|string} [frame] - If the Sprite image contains multiple frames you can specify which one to use here.
* @param {boolean} [exists=false] - The default exists state of the Sprite.
*/
Phaser.Group.prototype.createMultiple = function (quantity, key, frame, exists) {

    if (typeof exists === 'undefined') { exists = false; }

    for (var i = 0; i < quantity; i++)
    {
        this.create(0, 0, key, frame, exists);
    }

};

/**
* Internal method that re-applies all of the childrens Z values.
*
* This must be called whenever children ordering is altered so that their `z` indices are correctly updated.
*
* @method Phaser.Group#updateZ
* @protected
*/
Phaser.Group.prototype.updateZ = function () {

    var i = this.children.length;

    while (i--)
    {
        this.children[i].z = i;
    }

};

/**
* Sets the group cursor to the first child in the group.
*
* If the optional index parameter is given it sets the cursor to the object at that index instead.
*
* @method Phaser.Group#resetCursor
* @param {integer} [index=0] - Set the cursor to point to a specific index.
* @return {any} The child the cursor now points to.
*/
Phaser.Group.prototype.resetCursor = function (index) {

    if (typeof index === 'undefined') { index = 0; }

    if (index > this.children.length - 1)
    {
        index = 0;
    }

    if (this.cursor)
    {
        this.cursorIndex = index;
        this.cursor = this.children[this.cursorIndex];
        return this.cursor;
    }

};

/**
* Advances the group cursor to the next (higher) object in the group.
*
* If the cursor is at the end of the group (top child) it is moved the start of the group (bottom child).
*
* @method Phaser.Group#next
* @return {any} The child the cursor now points to.
*/
Phaser.Group.prototype.next = function () {

    if (this.cursor)
    {
        //  Wrap the cursor?
        if (this.cursorIndex >= this.children.length - 1)
        {
            this.cursorIndex = 0;
        }
        else
        {
            this.cursorIndex++;
        }

        this.cursor = this.children[this.cursorIndex];

        return this.cursor;
    }

};

/**
* Moves the group cursor to the previous (lower) child in the group.
*
* If the cursor is at the start of the group (bottom child) it is moved to the end (top child).
*
* @method Phaser.Group#previous
* @return {any} The child the cursor now points to.
*/
Phaser.Group.prototype.previous = function () {

    if (this.cursor)
    {
        //  Wrap the cursor?
        if (this.cursorIndex === 0)
        {
            this.cursorIndex = this.children.length - 1;
        }
        else
        {
            this.cursorIndex--;
        }

        this.cursor = this.children[this.cursorIndex];

        return this.cursor;
    }

};

/**
* Swaps the position of two children in this group.
*
* Both children must be in this group, a child cannot be swapped with itself, and unparented children cannot be swapped.
*
* @method Phaser.Group#swap
* @param {any} child1 - The first child to swap.
* @param {any} child2 - The second child to swap.
*/
Phaser.Group.prototype.swap = function (child1, child2) {

    this.swapChildren(child1, child2);
    this.updateZ();

};

/**
* Brings the given child to the top of this group so it renders above all other children.
*
* @method Phaser.Group#bringToTop
* @param {any} child - The child to bring to the top of this group.
* @return {any} The child that was moved.
*/
Phaser.Group.prototype.bringToTop = function (child) {

    if (child.parent === this && this.getIndex(child) < this.children.length)
    {
        this.remove(child, false, true);
        this.add(child, true);
    }

    return child;

};

/**
* Sends the given child to the bottom of this group so it renders below all other children.
*
* @method Phaser.Group#sendToBack
* @param {any} child - The child to send to the bottom of this group.
* @return {any} The child that was moved.
*/
Phaser.Group.prototype.sendToBack = function (child) {

    if (child.parent === this && this.getIndex(child) > 0)
    {
        this.remove(child, false, true);
        this.addAt(child, 0, true);
    }

    return child;

};

/**
* Moves the given child up one place in this group unless it's already at the top.
*
* @method Phaser.Group#moveUp
* @param {any} child - The child to move up in the group.
* @return {any} The child that was moved.
*/
Phaser.Group.prototype.moveUp = function (child) {

    if (child.parent === this && this.getIndex(child) < this.children.length - 1)
    {
        var a = this.getIndex(child);
        var b = this.getAt(a + 1);

        if (b)
        {
            this.swap(child, b);
        }
    }

    return child;

};

/**
* Moves the given child down one place in this group unless it's already at the bottom.
*
* @method Phaser.Group#moveDown
* @param {any} child - The child to move down in the group.
* @return {any} The child that was moved.
*/
Phaser.Group.prototype.moveDown = function (child) {

    if (child.parent === this && this.getIndex(child) > 0)
    {
        var a = this.getIndex(child);
        var b = this.getAt(a - 1);

        if (b)
        {
            this.swap(child, b);
        }
    }

    return child;

};

/**
* Positions the child found at the given index within this group to the given x and y coordinates.
*
* @method Phaser.Group#xy
* @param {integer} index - The index of the child in the group to set the position of.
* @param {number} x - The new x position of the child.
* @param {number} y - The new y position of the child.
*/
Phaser.Group.prototype.xy = function (index, x, y) {

    if (index < 0 || index > this.children.length)
    {
        return -1;
    }
    else
    {
        this.getChildAt(index).x = x;
        this.getChildAt(index).y = y;
    }

};

/**
* Reverses all children in this group.
*
* This operaation applies only to immediate children and does not propagate to subgroups.
*
* @method Phaser.Group#reverse
*/
Phaser.Group.prototype.reverse = function () {

    this.children.reverse();
    this.updateZ();

};

/**
* Get the index position of the given child in this group, which should match the child's `z` property.
*
* @method Phaser.Group#getIndex
* @param {any} child - The child to get the index for.
* @return {integer} The index of the child or -1 if it's not a member of this group.
*/
Phaser.Group.prototype.getIndex = function (child) {

    return this.children.indexOf(child);

};

/**
* Replaces a child of this group with the given newChild. The newChild cannot be a member of this group.
*
* @method Phaser.Group#replace
* @param {any} oldChild - The child in this group that will be replaced.
* @param {any} newChild - The child to be inserted into this group.
* @return {any} Returns the oldChild that was replaced within this group.
*/
Phaser.Group.prototype.replace = function (oldChild, newChild) {

    var index = this.getIndex(oldChild);

    if (index !== -1)
    {
        if (newChild.parent)
        {
            if (newChild.parent instanceof Phaser.Group)
            {
                newChild.parent.remove(newChild);
            }
            else
            {
                newChild.parent.removeChild(newChild);
            }
        }

        this.remove(oldChild);

        this.addAt(newChild, index);

        return oldChild;
    }

};

/**
* Checks if the child has the given property.
*
* Will scan up to 4 levels deep only.
*
* @method Phaser.Group#hasProperty
* @param {any} child - The child to check for the existance of the property on.
* @param {string[]} key - An array of strings that make up the property.
* @return {boolean} True if the child has the property, otherwise false.
*/
Phaser.Group.prototype.hasProperty = function (child, key) {

    var len = key.length;

    if (len === 1 && key[0] in child)
    {
        return true;
    }
    else if (len === 2 && key[0] in child && key[1] in child[key[0]])
    {
        return true;
    }
    else if (len === 3 && key[0] in child && key[1] in child[key[0]] && key[2] in child[key[0]][key[1]])
    {
        return true;
    }
    else if (len === 4 && key[0] in child && key[1] in child[key[0]] && key[2] in child[key[0]][key[1]] && key[3] in child[key[0]][key[1]][key[2]])
    {
        return true;
    }

    return false;

};

/**
* Sets a property to the given value on the child. The operation parameter controls how the value is set.
*
* The operations are:
* - 0: set the existing value to the given value; if force is `true` a new property will be created if needed
* - 1: will add the given value to the value already present.
* - 2: will subtract the given value from the value already present.
* - 3: will multiply the value already present by the given value.
* - 4: will divide the value already present by the given value.
*
* @method Phaser.Group#setProperty
* @param {any} child - The child to set the property value on.
* @param {array} key - An array of strings that make up the property that will be set.
* @param {any} value - The value that will be set.
* @param {integer} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
* @param {boolean} [force=false] - If `force` is true then the property will be set on the child regardless if it already exists or not. If false and the property doesn't exist, nothing will be set.
* @return {boolean} True if the property was set, false if not.
*/
Phaser.Group.prototype.setProperty = function (child, key, value, operation, force) {

    if (typeof force === 'undefined') { force = false; }

    operation = operation || 0;

    //  As ugly as this approach looks, and although it's limited to a depth of only 4, it's much faster than a for loop or object iteration.

    //  0 = Equals
    //  1 = Add
    //  2 = Subtract
    //  3 = Multiply
    //  4 = Divide

    //  We can't force a property in and the child doesn't have it, so abort.
    //  Equally we can't add, subtract, multiply or divide a property value if it doesn't exist, so abort in those cases too.
    if (!this.hasProperty(child, key) && (!force || operation > 0))
    {
        return false;
    }

    var len = key.length;

    if (len === 1)
    {
        if (operation === 0) { child[key[0]] = value; }
        else if (operation == 1) { child[key[0]] += value; }
        else if (operation == 2) { child[key[0]] -= value; }
        else if (operation == 3) { child[key[0]] *= value; }
        else if (operation == 4) { child[key[0]] /= value; }
    }
    else if (len === 2)
    {
        if (operation === 0) { child[key[0]][key[1]] = value; }
        else if (operation == 1) { child[key[0]][key[1]] += value; }
        else if (operation == 2) { child[key[0]][key[1]] -= value; }
        else if (operation == 3) { child[key[0]][key[1]] *= value; }
        else if (operation == 4) { child[key[0]][key[1]] /= value; }
    }
    else if (len === 3)
    {
        if (operation === 0) { child[key[0]][key[1]][key[2]] = value; }
        else if (operation == 1) { child[key[0]][key[1]][key[2]] += value; }
        else if (operation == 2) { child[key[0]][key[1]][key[2]] -= value; }
        else if (operation == 3) { child[key[0]][key[1]][key[2]] *= value; }
        else if (operation == 4) { child[key[0]][key[1]][key[2]] /= value; }
    }
    else if (len === 4)
    {
        if (operation === 0) { child[key[0]][key[1]][key[2]][key[3]] = value; }
        else if (operation == 1) { child[key[0]][key[1]][key[2]][key[3]] += value; }
        else if (operation == 2) { child[key[0]][key[1]][key[2]][key[3]] -= value; }
        else if (operation == 3) { child[key[0]][key[1]][key[2]][key[3]] *= value; }
        else if (operation == 4) { child[key[0]][key[1]][key[2]][key[3]] /= value; }
    }

    return true;

};

/**
* Checks a property for the given value on the child.
*
* @method Phaser.Group#checkProperty
* @param {any} child - The child to check the property value on.
* @param {array} key - An array of strings that make up the property that will be set.
* @param {any} value - The value that will be checked.
* @param {boolean} [force=false] - If `force` is true then the property will be checked on the child regardless if it already exists or not. If true and the property doesn't exist, false will be returned.
* @return {boolean} True if the property was was equal to value, false if not.
*/
Phaser.Group.prototype.checkProperty = function (child, key, value, force) {

    if (typeof force === 'undefined') { force = false; }

    //  We can't force a property in and the child doesn't have it, so abort.
    if (!Phaser.Utils.getProperty(child, key) && force)
    {
        return false;
    }

    if (Phaser.Utils.getProperty(child, key) !== value)
    {
        return false;
    }

    return true;

};

/**
* Quickly set a property on a single child of this group to a new value.
*
* The operation parameter controls how the new value is assigned to the property, from simple replacement to addition and multiplication.
*
* @method Phaser.Group#set
* @param {Phaser.Sprite} child - The child to set the property on.
* @param {string} key - The property, as a string, to be set. For example: 'body.velocity.x'
* @param {any} value - The value that will be set.
* @param {boolean} [checkAlive=false] - If set then the child will only be updated if alive=true.
* @param {boolean} [checkVisible=false] - If set then the child will only be updated if visible=true.
* @param {integer} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
* @param {boolean} [force=false] - If `force` is true then the property will be set on the child regardless if it already exists or not. If false and the property doesn't exist, nothing will be set.
* @return {boolean} True if the property was set, false if not.
*/
Phaser.Group.prototype.set = function (child, key, value, checkAlive, checkVisible, operation, force) {

    if (typeof force === 'undefined') { force = false; }

    key = key.split('.');

    if (typeof checkAlive === 'undefined') { checkAlive = false; }
    if (typeof checkVisible === 'undefined') { checkVisible = false; }

    if ((checkAlive === false || (checkAlive && child.alive)) && (checkVisible === false || (checkVisible && child.visible)))
    {
        return this.setProperty(child, key, value, operation, force);
    }

};

/**
* Quickly set the same property across all children of this group to a new value.
*
* This call doesn't descend down children, so if you have a Group inside of this group, the property will be set on the group but not its children.
* If you need that ability please see `Group.setAllChildren`.
*
* The operation parameter controls how the new value is assigned to the property, from simple replacement to addition and multiplication.
*
* @method Phaser.Group#setAll
* @param {string} key - The property, as a string, to be set. For example: 'body.velocity.x'
* @param {any} value - The value that will be set.
* @param {boolean} [checkAlive=false] - If set then only children with alive=true will be updated. This includes any Groups that are children.
* @param {boolean} [checkVisible=false] - If set then only children with visible=true will be updated. This includes any Groups that are children.
* @param {integer} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
* @param {boolean} [force=false] - If `force` is true then the property will be set on the child regardless if it already exists or not. If false and the property doesn't exist, nothing will be set.
*/
Phaser.Group.prototype.setAll = function (key, value, checkAlive, checkVisible, operation, force) {

    if (typeof checkAlive === 'undefined') { checkAlive = false; }
    if (typeof checkVisible === 'undefined') { checkVisible = false; }
    if (typeof force === 'undefined') { force = false; }

    key = key.split('.');
    operation = operation || 0;

    for (var i = 0; i < this.children.length; i++)
    {
        if ((!checkAlive || (checkAlive && this.children[i].alive)) && (!checkVisible || (checkVisible && this.children[i].visible)))
        {
            this.setProperty(this.children[i], key, value, operation, force);
        }
    }

};

/**
* Quickly set the same property across all children of this group, and any child Groups, to a new value.
*
* If this group contains other Groups then the same property is set across their children as well, iterating down until it reaches the bottom.
* Unlike with `setAll` the property is NOT set on child Groups itself.
*
* The operation parameter controls how the new value is assigned to the property, from simple replacement to addition and multiplication.
*
* @method Phaser.Group#setAllChildren
* @param {string} key - The property, as a string, to be set. For example: 'body.velocity.x'
* @param {any} value - The value that will be set.
* @param {boolean} [checkAlive=false] - If set then only children with alive=true will be updated. This includes any Groups that are children.
* @param {boolean} [checkVisible=false] - If set then only children with visible=true will be updated. This includes any Groups that are children.
* @param {integer} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
* @param {boolean} [force=false] - If `force` is true then the property will be set on the child regardless if it already exists or not. If false and the property doesn't exist, nothing will be set.
*/
Phaser.Group.prototype.setAllChildren = function (key, value, checkAlive, checkVisible, operation, force) {

    if (typeof checkAlive === 'undefined') { checkAlive = false; }
    if (typeof checkVisible === 'undefined') { checkVisible = false; }
    if (typeof force === 'undefined') { force = false; }

    operation = operation || 0;

    for (var i = 0; i < this.children.length; i++)
    {
        if ((!checkAlive || (checkAlive && this.children[i].alive)) && (!checkVisible || (checkVisible && this.children[i].visible)))
        {
            if (this.children[i] instanceof Phaser.Group)
            {
                this.children[i].setAllChildren(key, value, checkAlive, checkVisible, operation, force);
            }
            else
            {
                this.setProperty(this.children[i], key.split('.'), value, operation, force);
            }
        }
    }

};

/**
* Quickly check that the same property across all children of this group is equal to the given value.
*
* This call doesn't descend down children, so if you have a Group inside of this group, the property will be checked on the group but not its children.
*
* @method Phaser.Group#checkAll
* @param {string} key - The property, as a string, to be set. For example: 'body.velocity.x'
* @param {any} value - The value that will be checked.
* @param {boolean} [checkAlive=false] - If set then only children with alive=true will be checked. This includes any Groups that are children.
* @param {boolean} [checkVisible=false] - If set then only children with visible=true will be checked. This includes any Groups that are children.
* @param {boolean} [force=false] - If `force` is true then the property will be checked on the child regardless if it already exists or not. If true and the property doesn't exist, false will be returned.
*/
Phaser.Group.prototype.checkAll = function (key, value, checkAlive, checkVisible, force) {

    if (typeof checkAlive === 'undefined') { checkAlive = false; }
    if (typeof checkVisible === 'undefined') { checkVisible = false; }
    if (typeof force === 'undefined') { force = false; }

    for (var i = 0; i < this.children.length; i++)
    {
        if ((!checkAlive || (checkAlive && this.children[i].alive)) && (!checkVisible || (checkVisible && this.children[i].visible)))
        {
            if (!this.checkProperty(this.children[i], key, value, force))
            {
                return false;
            }
        }
    }

    return true;

};

/**
* Adds the amount to the given property on all children in this group.
*
* `Group.addAll('x', 10)` will add 10 to the child.x value for each child.
*
* @method Phaser.Group#addAll
* @param {string} property - The property to increment, for example 'body.velocity.x' or 'angle'.
* @param {number} amount - The amount to increment the property by. If child.x = 10 then addAll('x', 40) would make child.x = 50.
* @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
* @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
*/
Phaser.Group.prototype.addAll = function (property, amount, checkAlive, checkVisible) {

    this.setAll(property, amount, checkAlive, checkVisible, 1);

};

/**
* Subtracts the amount from the given property on all children in this group.
*
* `Group.subAll('x', 10)` will minus 10 from the child.x value for each child.
*
* @method Phaser.Group#subAll
* @param {string} property - The property to decrement, for example 'body.velocity.x' or 'angle'.
* @param {number} amount - The amount to subtract from the property. If child.x = 50 then subAll('x', 40) would make child.x = 10.
* @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
* @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
*/
Phaser.Group.prototype.subAll = function (property, amount, checkAlive, checkVisible) {

    this.setAll(property, amount, checkAlive, checkVisible, 2);

};

/**
* Multiplies the given property by the amount on all children in this group.
*
* `Group.multiplyAll('x', 2)` will x2 the child.x value for each child.
*
* @method Phaser.Group#multiplyAll
* @param {string} property - The property to multiply, for example 'body.velocity.x' or 'angle'.
* @param {number} amount - The amount to multiply the property by. If child.x = 10 then multiplyAll('x', 2) would make child.x = 20.
* @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
* @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
*/
Phaser.Group.prototype.multiplyAll = function (property, amount, checkAlive, checkVisible) {

    this.setAll(property, amount, checkAlive, checkVisible, 3);

};

/**
* Divides the given property by the amount on all children in this group.
*
* `Group.divideAll('x', 2)` will half the child.x value for each child.
*
* @method Phaser.Group#divideAll
* @param {string} property - The property to divide, for example 'body.velocity.x' or 'angle'.
* @param {number} amount - The amount to divide the property by. If child.x = 100 then divideAll('x', 2) would make child.x = 50.
* @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
* @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
*/
Phaser.Group.prototype.divideAll = function (property, amount, checkAlive, checkVisible) {

    this.setAll(property, amount, checkAlive, checkVisible, 4);

};

/**
* Calls a function, specified by name, on all children in the group who exist (or do not exist).
*
* After the existsValue parameter you can add as many parameters as you like, which will all be passed to the child callback.
*
* @method Phaser.Group#callAllExists
* @param {string} callback - Name of the function on the children to call.
* @param {boolean} existsValue - Only children with exists=existsValue will be called.
* @param {...any} parameter - Additional parameters that will be passed to the callback.
*/
Phaser.Group.prototype.callAllExists = function (callback, existsValue) {

    var args;

    if (arguments.length > 2)
    {
        args = [];

        for (var i = 2; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }
    }

    for (var i = 0; i < this.children.length; i++)
    {
        if (this.children[i].exists === existsValue && this.children[i][callback])
        {
            this.children[i][callback].apply(this.children[i], args);
        }
    }

};

/**
* Returns a reference to a function that exists on a child of the group based on the given callback array.
*
* @method Phaser.Group#callbackFromArray
* @param {object} child - The object to inspect.
* @param {array} callback - The array of function names.
* @param {integer} length - The size of the array (pre-calculated in callAll).
* @protected
*/
Phaser.Group.prototype.callbackFromArray = function (child, callback, length) {

    //  Kinda looks like a Christmas tree

    if (length == 1)
    {
        if (child[callback[0]])
        {
            return child[callback[0]];
        }
    }
    else if (length == 2)
    {
        if (child[callback[0]][callback[1]])
        {
            return child[callback[0]][callback[1]];
        }
    }
    else if (length == 3)
    {
        if (child[callback[0]][callback[1]][callback[2]])
        {
            return child[callback[0]][callback[1]][callback[2]];
        }
    }
    else if (length == 4)
    {
        if (child[callback[0]][callback[1]][callback[2]][callback[3]])
        {
            return child[callback[0]][callback[1]][callback[2]][callback[3]];
        }
    }
    else
    {
        if (child[callback])
        {
            return child[callback];
        }
    }

    return false;

};

/**
* Calls a function, specified by name, on all on children.
*
* The function is called for all children regardless if they are dead or alive (see callAllExists for different options).
* After the method parameter and context you can add as many extra parameters as you like, which will all be passed to the child.
*
* @method Phaser.Group#callAll
* @param {string} method - Name of the function on the child to call. Deep property lookup is supported.
* @param {string} [context=null] - A string containing the context under which the method will be executed. Set to null to default to the child.
* @param {...any} args - Additional parameters that will be passed to the method.
*/
Phaser.Group.prototype.callAll = function (method, context) {

    if (typeof method === 'undefined')
    {
        return;
    }

    //  Extract the method into an array
    method = method.split('.');

    var methodLength = method.length;

    if (typeof context === 'undefined' || context === null || context === '')
    {
        context = null;
    }
    else
    {
        //  Extract the context into an array
        if (typeof context === 'string')
        {
            context = context.split('.');
            var contextLength = context.length;
        }
    }

    var args;

    if (arguments.length > 2)
    {
        args = [];

        for (var i = 2; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }
    }

    var callback = null;
    var callbackContext = null;

    for (var i = 0; i < this.children.length; i++)
    {
        callback = this.callbackFromArray(this.children[i], method, methodLength);

        if (context && callback)
        {
            callbackContext = this.callbackFromArray(this.children[i], context, contextLength);

            if (callback)
            {
                callback.apply(callbackContext, args);
            }
        }
        else if (callback)
        {
            callback.apply(this.children[i], args);
        }
    }

};

/**
* The core preUpdate - as called by World.
* @method Phaser.Group#preUpdate
* @protected
*/
Phaser.Group.prototype.preUpdate = function () {

    if (!this.exists || !this.parent.exists)
    {
        this.renderOrderID = -1;
        return false;
    }

    var i = this.children.length;

    while (i--)
    {
        this.children[i].preUpdate();
    }

    return true;

};

/**
* The core update - as called by World.
* @method Phaser.Group#update
* @protected
*/
Phaser.Group.prototype.update = function () {

    var i = this.children.length;

    while (i--)
    {
        this.children[i].update();
    }

};

/**
* The core postUpdate - as called by World.
* @method Phaser.Group#postUpdate
* @protected
*/
Phaser.Group.prototype.postUpdate = function () {

    //  Fixed to Camera?
    if (this.fixedToCamera)
    {
        this.x = this.game.camera.view.x + this.cameraOffset.x;
        this.y = this.game.camera.view.y + this.cameraOffset.y;
    }

    var i = this.children.length;

    while (i--)
    {
        this.children[i].postUpdate();
    }

};


/**
* Find children matching a certain predicate.
*
* For example:
*
*     var healthyList = Group.filter(function(child, index, children) {
*         return child.health > 10 ? true : false;
*     }, true);
*     healthyList.callAll('attack');
*
* Note: Currently this will skip any children which are Groups themselves.
*
* @method Phaser.Group#filter
* @param {function} predicate - The function that each child will be evaluated against. Each child of the group will be passed to it as its first parameter, the index as the second, and the entire child array as the third
* @param {boolean} [checkExists=false] - If true, only existing can be selected; otherwise all children can be selected and will be passed to the predicate.
* @return {Phaser.ArraySet} Returns an array list containing all the children that the predicate returned true for
*/
Phaser.Group.prototype.filter = function (predicate, checkExists) {

    var index = -1;
    var length = this.children.length;
    var results = [];

    while (++index < length)
    {
        var child = this.children[index];

        if (!checkExists || (checkExists && child.exists))
        {
            if (predicate(child, index, this.children))
            {
                results.push(child);
            }
        }
    }

    return new Phaser.ArraySet(results);

};

/**
* Call a function on each child in this group.
*
* Additional arguments for the callback can be specified after the `checkExists` parameter. For example,
*
*     Group.forEach(awardBonusGold, this, true, 100, 500)
*
* would invoke `awardBonusGold` function with the parameters `(child, 100, 500)`.
*
* Note: This check will skip any children which are Groups themselves.
*
* @method Phaser.Group#forEach
* @param {function} callback - The function that will be called for each applicable child. The child will be passed as the first argument.
* @param {object} callbackContext - The context in which the function should be called (usually 'this').
* @param {boolean} [checkExists=false] - If set only children matching for which `exists` is true will be passed to the callback, otherwise all children will be passed.
* @param {...any} [args=(none)] - Additional arguments to pass to the callback function, after the child item.
*/
Phaser.Group.prototype.forEach = function (callback, callbackContext, checkExists) {

    if (typeof checkExists === 'undefined') { checkExists = false; }

    if (arguments.length <= 3)
    {
        for (var i = 0; i < this.children.length; i++)
        {
            if (!checkExists || (checkExists && this.children[i].exists))
            {
                callback.call(callbackContext, this.children[i]);
            }
        }
    }
    else
    {
        // Assigning to arguments properties causes Extreme Deoptimization in Chrome, FF, and IE.
        // Using an array and pushing each element (not a slice!) is _significantly_ faster.
        var args = [null];

        for (var i = 3; i < arguments.length; i++) { args.push(arguments[i]); }

        for (var i = 0; i < this.children.length; i++)
        {
            if (!checkExists || (checkExists && this.children[i].exists))
            {
                args[0] = this.children[i];
                callback.apply(callbackContext, args);
            }
        }
    }

};

/**
* Call a function on each existing child in this group.
*
* See {@link Phaser.Group#forEach forEach} for details.
*
* @method Phaser.Group#forEachExists
* @param {function} callback - The function that will be called for each applicable child. The child will be passed as the first argument.
* @param {object} callbackContext - The context in which the function should be called (usually 'this').
* @param {...any} [args=(none)] - Additional arguments to pass to the callback function, after the child item.
*/
Phaser.Group.prototype.forEachExists = function (callback, callbackContext) {

    var args;

    if (arguments.length > 2)
    {
        args = [null];

        for (var i = 2; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }
    }

    this.iterate('exists', true, Phaser.Group.RETURN_TOTAL, callback, callbackContext, args);

};

/**
* Call a function on each alive child in this group.
*
* See {@link Phaser.Group#forEach forEach} for details.
*
* @method Phaser.Group#forEachAlive
* @param {function} callback - The function that will be called for each applicable child. The child will be passed as the first argument.
* @param {object} callbackContext - The context in which the function should be called (usually 'this').
* @param {...any} [args=(none)] - Additional arguments to pass to the callback function, after the child item.
*/
Phaser.Group.prototype.forEachAlive = function (callback, callbackContext) {

    var args;

    if (arguments.length > 2)
    {
        args = [null];

        for (var i = 2; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }
    }

    this.iterate('alive', true, Phaser.Group.RETURN_TOTAL, callback, callbackContext, args);

};

/**
* Call a function on each dead child in this group.
*
* See {@link Phaser.Group#forEach forEach} for details.
*
* @method Phaser.Group#forEachDead
* @param {function} callback - The function that will be called for each applicable child. The child will be passed as the first argument.
* @param {object} callbackContext - The context in which the function should be called (usually 'this').
* @param {...any} [args=(none)] - Additional arguments to pass to the callback function, after the child item.
*/
Phaser.Group.prototype.forEachDead = function (callback, callbackContext) {

    var args;

    if (arguments.length > 2)
    {
        args = [null];

        for (var i = 2; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }
    }

    this.iterate('alive', false, Phaser.Group.RETURN_TOTAL, callback, callbackContext, args);

};

/**
* Sort the children in the group according to a particular key and ordering.
*
* Call this function to sort the group according to a particular key value and order.
* For example to depth sort Sprites for Zelda-style game you might call `group.sort('y', Phaser.Group.SORT_ASCENDING)` at the bottom of your `State.update()`.
*
* @method Phaser.Group#sort
* @param {string} [key='z'] - The name of the property to sort on. Defaults to the objects z-depth value.
* @param {integer} [order=Phaser.Group.SORT_ASCENDING] - Order ascending ({@link Phaser.Group.SORT_ASCENDING SORT_ASCENDING}) or descending ({@link Phaser.Group.SORT_DESCENDING SORT_DESCENDING}).
*/
Phaser.Group.prototype.sort = function (key, order) {

    if (this.children.length < 2)
    {
        //  Nothing to swap
        return;
    }

    if (typeof key === 'undefined') { key = 'z'; }
    if (typeof order === 'undefined') { order = Phaser.Group.SORT_ASCENDING; }

    this._sortProperty = key;

    if (order === Phaser.Group.SORT_ASCENDING)
    {
        this.children.sort(this.ascendingSortHandler.bind(this));
    }
    else
    {
        this.children.sort(this.descendingSortHandler.bind(this));
    }

    this.updateZ();

};

/**
* Sort the children in the group according to custom sort function.
*
* The `sortHandler` is provided the two parameters: the two children involved in the comparison (a and b).
* It should return -1 if `a > b`, 1 if `a < b` or 0 if `a === b`.
*
* @method Phaser.Group#customSort
* @param {function} sortHandler - The custom sort function.
* @param {object} [context=undefined] - The context in which the sortHandler is called.
*/
Phaser.Group.prototype.customSort = function (sortHandler, context) {

    if (this.children.length < 2)
    {
        //  Nothing to swap
        return;
    }

    this.children.sort(sortHandler.bind(context));

    this.updateZ();

};

/**
* An internal helper function for the sort process.
*
* @method Phaser.Group#ascendingSortHandler
* @protected
* @param {object} a - The first object being sorted.
* @param {object} b - The second object being sorted.
*/
Phaser.Group.prototype.ascendingSortHandler = function (a, b) {

    if (a[this._sortProperty] < b[this._sortProperty])
    {
        return -1;
    }
    else if (a[this._sortProperty] > b[this._sortProperty])
    {
        return 1;
    }
    else
    {
        if (a.z < b.z)
        {
            return -1;
        }
        else
        {
            return 1;
        }
    }

};

/**
* An internal helper function for the sort process.
*
* @method Phaser.Group#descendingSortHandler
* @protected
* @param {object} a - The first object being sorted.
* @param {object} b - The second object being sorted.
*/
Phaser.Group.prototype.descendingSortHandler = function (a, b) {

    if (a[this._sortProperty] < b[this._sortProperty])
    {
        return 1;
    }
    else if (a[this._sortProperty] > b[this._sortProperty])
    {
        return -1;
    }
    else
    {
        return 0;
    }

};

/**
* Iterates over the children of the group performing one of several actions for matched children.
*
* A child is considered a match when it has a property, named `key`, whose value is equal to `value`
* according to a strict equality comparison.
*
* The result depends on the `returnType`:
*
* - {@link Phaser.Group.RETURN_TOTAL RETURN_TOTAL}:
*     The callback, if any, is applied to all matching children. The number of matched children is returned.
* - {@link Phaser.Group.RETURN_NONE RETURN_NONE}:
*     The callback, if any, is applied to all matching children. No value is returned.
* - {@link Phaser.Group.RETURN_CHILD RETURN_CHILD}:
*     The callback, if any, is applied to the *first* matching child and the *first* matched child is returned.
*     If there is no matching child then null is returned.
*
* If `args` is specified it must be an array. The matched child will be assigned to the first
* element and the entire array will be applied to the callback function.
*
* @method Phaser.Group#iterate
* @param {string} key - The child property to check, i.e. 'exists', 'alive', 'health'
* @param {any} value - A child matches if `child[key] === value` is true.
* @param {integer} returnType - How to iterate the children and what to return.
* @param {function} [callback=null] - Optional function that will be called on each matching child. The matched child is supplied as the first argument.
* @param {object} [callbackContext] - The context in which the function should be called (usually 'this').
* @param {any[]} [args=(none)] - The arguments supplied to to the callback; the first array index (argument) will be replaced with the matched child.
* @return {any} Returns either an integer (for RETURN_TOTAL), the first matched child (for RETURN_CHILD), or null.
*/
Phaser.Group.prototype.iterate = function (key, value, returnType, callback, callbackContext, args) {

    if (returnType === Phaser.Group.RETURN_TOTAL && this.children.length === 0)
    {
        return 0;
    }

    var total = 0;

    for (var i = 0; i < this.children.length; i++)
    {
        if (this.children[i][key] === value)
        {
            total++;

            if (callback)
            {
                if (args)
                {
                    args[0] = this.children[i];
                    callback.apply(callbackContext, args);
                }
                else
                {
                    callback.call(callbackContext, this.children[i]);
                }
            }

            if (returnType === Phaser.Group.RETURN_CHILD)
            {
                return this.children[i];
            }
        }
    }

    if (returnType === Phaser.Group.RETURN_TOTAL)
    {
        return total;
    }

    // RETURN_CHILD or RETURN_NONE
    return null;

};

/**
* Get the first display object that exists, or doesn't exist.
*
* @method Phaser.Group#getFirstExists
* @param {boolean} [exists=true] - If true, find the first existing child; otherwise find the first non-existing child.
* @return {any} The first child, or null if none found.
*/
Phaser.Group.prototype.getFirstExists = function (exists) {

    if (typeof exists !== 'boolean')
    {
        exists = true;
    }

    return this.iterate('exists', exists, Phaser.Group.RETURN_CHILD);

};

/**
* Get the first child that is alive (`child.alive === true`).
*
* This is handy for checking if everything has been wiped out, or choosing a squad leader, etc.
*
* @method Phaser.Group#getFirstAlive
* @return {any} The first alive child, or null if none found.
*/
Phaser.Group.prototype.getFirstAlive = function () {

    return this.iterate('alive', true, Phaser.Group.RETURN_CHILD);

};

/**
* Get the first child that is dead (`child.alive === false`).
*
* This is handy for checking if everything has been wiped out, or choosing a squad leader, etc.
*
* @method Phaser.Group#getFirstDead
* @return {any} The first dead child, or null if none found.
*/
Phaser.Group.prototype.getFirstDead = function () {

    return this.iterate('alive', false, Phaser.Group.RETURN_CHILD);

};

/**
* Return the child at the top of this group.
*
* The top child is the child displayed (rendered) above every other child.
*
* @method Phaser.Group#getTop
* @return {any} The child at the top of the Group.
*/
Phaser.Group.prototype.getTop = function () {

    if (this.children.length > 0)
    {
        return this.children[this.children.length - 1];
    }

};

/**
* Returns the child at the bottom of this group.
*
* The bottom child the child being displayed (rendered) below every other child.
*
* @method Phaser.Group#getBottom
* @return {any} The child at the bottom of the Group.
*/
Phaser.Group.prototype.getBottom = function () {

    if (this.children.length > 0)
    {
        return this.children[0];
    }

};

/**
* Get the number of living children in this group.
*
* @method Phaser.Group#countLiving
* @return {integer} The number of children flagged as alive.
*/
Phaser.Group.prototype.countLiving = function () {

    return this.iterate('alive', true, Phaser.Group.RETURN_TOTAL);

};

/**
* Get the number of dead children in this group.
*
* @method Phaser.Group#countDead
* @return {integer} The number of children flagged as dead.
*/
Phaser.Group.prototype.countDead = function () {

    return this.iterate('alive', false, Phaser.Group.RETURN_TOTAL);

};

/**
* Returns a random child from the group.
*
* @method Phaser.Group#getRandom
* @param {integer} [startIndex=0] - Offset from the front of the front of the group (lowest child).
* @param {integer} [length=(to top)] - Restriction on the number of values you want to randomly select from.
* @return {any} A random child of this Group.
*/
Phaser.Group.prototype.getRandom = function (startIndex, length) {

    if (this.children.length === 0)
    {
        return null;
    }

    startIndex = startIndex || 0;
    length = length || this.children.length;

    return Phaser.ArrayUtils.getRandomItem(this.children, startIndex, length);

};

/**
* Removes the given child from this group.
*
* This will dispatch an `onRemovedFromGroup` event from the child (if it has one), and optionally destroy the child.
*
* If the group cursor was referring to the removed child it is updated to refer to the next child.
*
* @method Phaser.Group#remove
* @param {any} child - The child to remove.
* @param {boolean} [destroy=false] - If true `destroy` will be invoked on the removed child.
* @param {boolean} [silent=false] - If true the the child will not dispatch the `onRemovedFromGroup` event.
* @return {boolean} true if the child was removed from this group, otherwise false.
*/
Phaser.Group.prototype.remove = function (child, destroy, silent) {

    if (typeof destroy === 'undefined') { destroy = false; }
    if (typeof silent === 'undefined') { silent = false; }

    if (this.children.length === 0 || this.children.indexOf(child) === -1)
    {
        return false;
    }

    if (!silent && child.events && !child.destroyPhase)
    {
        child.events.onRemovedFromGroup$dispatch(child, this);
    }

    var removed = this.removeChild(child);

    var index = this._hash.indexOf(removed);

    if (index !== -1)
    {
        this._hash.splice(index, 1);
    }

    this.updateZ();

    if (this.cursor === child)
    {
        this.next();
    }

    if (destroy && removed)
    {
        removed.destroy(true);
    }

    return true;

};

/**
* Removes all children from this group, but does not remove the group from its parent.
*
* @method Phaser.Group#removeAll
* @param {boolean} [destroy=false] - If true `destroy` will be invoked on each removed child.
* @param {boolean} [silent=false] - If true the children will not dispatch their `onRemovedFromGroup` events.
*/
Phaser.Group.prototype.removeAll = function (destroy, silent) {

    if (typeof destroy === 'undefined') { destroy = false; }
    if (typeof silent === 'undefined') { silent = false; }

    if (this.children.length === 0)
    {
        return;
    }

    do
    {
        if (!silent && this.children[0].events)
        {
            this.children[0].events.onRemovedFromGroup$dispatch(this.children[0], this);
        }

        var removed = this.removeChild(this.children[0]);

        var index = this._hash.indexOf(removed);

        if (index !== -1)
        {
            this._hash.splice(index, 1);
        }

        if (destroy && removed)
        {
            removed.destroy(true);
        }
    }
    while (this.children.length > 0);

    this._hash = [];

    this.cursor = null;

};

/**
* Removes all children from this group whose index falls beteen the given startIndex and endIndex values.
*
* @method Phaser.Group#removeBetween
* @param {integer} startIndex - The index to start removing children from.
* @param {integer} [endIndex] - The index to stop removing children at. Must be higher than startIndex. If undefined this method will remove all children between startIndex and the end of the group.
* @param {boolean} [destroy=false] - If true `destroy` will be invoked on each removed child.
* @param {boolean} [silent=false] - If true the children will not dispatch their `onRemovedFromGroup` events.
*/
Phaser.Group.prototype.removeBetween = function (startIndex, endIndex, destroy, silent) {

    if (typeof endIndex === 'undefined') { endIndex = this.children.length - 1; }
    if (typeof destroy === 'undefined') { destroy = false; }
    if (typeof silent === 'undefined') { silent = false; }

    if (this.children.length === 0)
    {
        return;
    }

    if (startIndex > endIndex || startIndex < 0 || endIndex > this.children.length)
    {
        return false;
    }

    var i = endIndex;

    while (i >= startIndex)
    {
        if (!silent && this.children[i].events)
        {
            this.children[i].events.onRemovedFromGroup$dispatch(this.children[i], this);
        }

        var removed = this.removeChild(this.children[i]);

        var index = this._hash.indexOf(removed);

        if (index !== -1)
        {
            this._hash.splice(index, 1);
        }

        if (destroy && removed)
        {
            removed.destroy(true);
        }

        if (this.cursor === this.children[i])
        {
            this.cursor = null;
        }

        i--;
    }

    this.updateZ();

};

/**
* Destroys this group.
*
* Removes all children, then removes this group from its parent and nulls references.
*
* @method Phaser.Group#destroy
* @param {boolean} [destroyChildren=true] - If true `destroy` will be invoked on each removed child.
* @param {boolean} [soft=false] - A 'soft destroy' (set to true) doesn't remove this group from its parent or null the game reference. Set to false and it does.
*/
Phaser.Group.prototype.destroy = function (destroyChildren, soft) {

    if (this.game === null || this.ignoreDestroy) { return; }

    if (typeof destroyChildren === 'undefined') { destroyChildren = true; }
    if (typeof soft === 'undefined') { soft = false; }

    this.onDestroy.dispatch(this, destroyChildren, soft);

    this.removeAll(destroyChildren);

    this.cursor = null;
    this.filters = null;

    if (!soft)
    {
        if (this.parent)
        {
            this.parent.removeChild(this);
        }

        this.game = null;
        this.exists = false;
    }

};

/**
* Total number of existing children in the group.
*
* @name Phaser.Group#total
* @property {integer} total
* @readonly
*/
Object.defineProperty(Phaser.Group.prototype, "total", {

    get: function () {

        return this.iterate('exists', true, Phaser.Group.RETURN_TOTAL);

    }

});

/**
* Total number of children in this group, regardless of exists/alive status.
*
* @name Phaser.Group#length
* @property {integer} length
* @readonly
*/
Object.defineProperty(Phaser.Group.prototype, "length", {

    get: function () {

        return this.children.length;

    }

});

/**
* The angle of rotation of the group container, in degrees.
*
* This adjusts the group itself by modifying its local rotation transform.
*
* This has no impact on the rotation/angle properties of the children, but it will update their worldTransform
* and on-screen orientation and position.
*
* @name Phaser.Group#angle
* @property {number} angle
*/
Object.defineProperty(Phaser.Group.prototype, "angle", {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

/**
* A display object is any object that can be rendered in the Phaser/pixi.js scene graph.
*
* This includes {@link Phaser.Group} (groups are display objects!),
* {@link Phaser.Sprite}, {@link Phaser.Button}, {@link Phaser.Text}
* as well as {@link PIXI.DisplayObject} and all derived types.
*
* @typedef {object} DisplayObject
*/
// Documentation stub for linking.

/**
* The x coordinate of the group container.
*
* You can adjust the group container itself by modifying its coordinates.
* This will have no impact on the x/y coordinates of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#x
* @property {number} x
*/

/**
* The y coordinate of the group container.
*
* You can adjust the group container itself by modifying its coordinates.
* This will have no impact on the x/y coordinates of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#y
* @property {number} y
*/

/**
* The angle of rotation of the group container, in radians.
*
* This will adjust the group container itself by modifying its rotation.
* This will have no impact on the rotation value of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#rotation
* @property {number} rotation
*/

/**
* The visible state of the group. Non-visible Groups and all of their children are not rendered.
*
* @name Phaser.Group#visible
* @property {boolean} visible
*/

/**
* The alpha value of the group container.
*
* @name Phaser.Group#alpha
* @property {number} alpha
*/
