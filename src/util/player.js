/**
 * @file Contains the Player class which used to maintain
 * 		 information about the users in a current game.
 * @author EmilG <emildegraaf@gmail.com>
 * @see {@link https://github.com/EmilGraaf/quizzer}
 */

class Player {
	constructor(user) {
		this.client = user;
		this.health = 3;
		this.score = 0;
	}
	/**
	 * @desc Returns the ID of the player.
	 * @returns {String} - The user ID.
	 */
	getID() {
		return this.client.id;
	}
	/**
	 * @desc Returns the username of the player.
	 * @returns {String} - The username.
	 */
	getName() {
		return this.client.username;
	}
	/**
	 * @desc Decrement the player health.
	 */
	takeDamage() {
		this.health -= 1;
	}
	/**
	 * @desc Increment the player score.
	 */
	increaseScore() {
		this.score += 1;
	}
	/**
	 * @desc Check if the player is dead.
	 * @returns {Boolean} - A boolean indicating if the player is dead.
	 */
	isDead() {
		return (this.health <= 0);
	}
}

module.exports.Player = Player;