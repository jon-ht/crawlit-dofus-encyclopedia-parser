import { Item } from './item.model';

export default class Weapon extends Item {
	constructor(itemProperties, statistics, conditions, recipe, setId = null, characteristic) {
		super(itemProperties);
		this.condition = conditions;
		this.stats = statistics;
		this.characteristic = characteristic;
		this.recipe = recipe;
		this.setId = parseInt(setId, 10);
	}
}