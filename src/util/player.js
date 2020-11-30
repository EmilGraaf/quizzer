class Player {
	constructor(user) {
		this.client = user;
		this.health = 3;
		this.score = 0;
	}
	getID() {
		return this.client.id;
	}
	getName() {
		return this.client.username;
	}
	takeDamage() {
		this.health -= 1;
	}
	increaseScore() {
		this.score += 1;
	}
	isDead() {
		return (this.health <= 0);
	}
}

module.exports.Player = Player;