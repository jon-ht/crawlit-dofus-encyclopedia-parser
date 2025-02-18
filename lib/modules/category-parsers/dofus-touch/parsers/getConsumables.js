const request = require('request-promise-native');
const cheerio = require('cheerio');
const { sanatizer } = require('../services/format-helpers');
const { effectParse, recipeParse, descriptionParse } = require('../services/parser-helpers');

const requestOpts = {
	url: '',
	transform: function (body) {
		return cheerio.load(body);
	}
};
let item = {};
let body = '';

const getConsumables = exports.getConsumables = function (url) {
	requestOpts.url = url;
	return request(requestOpts).then(function ($) {
		/// //// Global initializations ///////
		body = $.html();

		/// //// Description parse ///////
		item = descriptionParse(body, url);

		/// //// Tabs initializations ///////
		item['stats'] = [];
		item['condition'] = [];
		item['recipe'] = [];

		/// //// Effects & condtions parse ///////
		const $akContainer = $('div.ak-encyclo-detail-right.ak-nocontentpadding').find('div.ak-container.ak-panel');
		if (typeof $akContainer.eq(1) !== 'undefined') {
			$akContainer.eq(1).find('div.col-sm-6').each(function (i, element) {
				const infoCategory = $(this).find('div.ak-panel-title').text().trim().toLowerCase();
				categorySwitch(infoCategory, $(this).html());
			});
		}

		/// //// Recipes parse ///////
		if (typeof $('div.ak-container.ak-panel.ak-crafts') !== 'undefined') {
			item['recipe'] = recipeParse(body);
		}
		return item;
	});
};

function conditionParse(body) {
	const $ = cheerio.load(body);
	let condition = $('div.ak-container.ak-panel.no-padding').find('div.ak-list-element').find('div.ak-title').remove('br').text().trim();
	condition = sanatizer(condition);
	let conditionTab = condition.split('et');
	conditionTab = conditionTab.map(function (string) {
		return sanatizer(string).trim();
	});
	item['condition'] = conditionTab;
}

function categorySwitch(infoCategory, body) {
	const $ = cheerio.load(body);
	switch (infoCategory) {
	case 'effets':
		item['stats'] = effectParse(body);
		break;
	case 'effects':
		item['stats'] = effectParse(body);
		break;
	case 'conditions':
		conditionParse(body);
		break;
	default:
		console.log('Sorry, we are out of ' + infoCategory + '.');
	}
}