//=========================================================
// Cae_BattleMessages.js
//=========================================================

/*:
 * @plugindesc v1.0 - Customise various battle messages with notetags.
 * @author Caethyril
 *
 * @help Plugin Commands:
 *   None.
 *
 * Help:
 *   This plugin allows you to customise emerge messages:
 *    - troop style: one message using the name of the troop.
 *    - group style: one message using the leader's name.
 *    - enemy style: one message per enemy (default).
 *   There are options for customising each enemy's emerge message.
 *   You can make multiple enemies display as a single "plural" name.
 *   Also, you can set custom add/remove state messages for actors/enemies.
 *
 * Tags:
 *   Troop Name Tags:       <group>
 *                          <group: x>
 *     Troop member x (or a random one if unspecified) is group leader.
 *      - Use x = 0 for the first member of the troop.
 *      - Note that only one message will be shown per unique enemy name...
 *        E.g. bat, bat, bat, orc: use <group: 1> to make the orc leader.
 *     The troop's emerge message will use the group leader's name.
 *     Customise the default group emerge message via the plugin parameters.
 *
 *   Troop Name Tags:       <emerge: blah>
 *                          <preemptive: blah>
 *                          <surprise: blah>
 *     Assign custom messages for emerge, preemptive, and surprise.
 *     Emerge message uses %1 = troop name (or group name if <group>).
 *     Preemptive and surprise messages use %1 = party name.
 *
 *   Enemy Notetag:         <emerge: blah>
 *     Assigns a custom per-enemy emerge message.
 *     Use %1 for the enemy name.
 *
 *   Enemy Notetag:         <plural: blah>
 *     An alternative name for multiple enemies of this type.
 *     Use %1 for the number of enemies, e.g. for a troop with 2 sheep:
 *        Default                   - "Sheep appeared!"
 *        <plural: Flock of sheep>  - "Flock of sheep appeared!"
 *        <plural: %1 fluffy sheep> - "2 fluffy sheep appeared!"
 *
 *   Actor/Enemy Notetags:  <state # add text: blah>
 *                          <state # rem text: blah>
 *     Assigns a custom add/remove state message; swap # for the state ID.
 *     State messages will always display after the name of the target.
 *
 *   For these tags:
 *     Replace 'blah' with the text you would like to use.
 *     Separate multiple values with a | character, e.g.
 *         <emerge:A screeching %1 approaches!|A %1 swoops down upon you!>
 *     Where multiple values exist, one will be chosen randomly.
 *     Empty custom emerge messages will be replaced with the default one.
 *
 *   Combining emerge-related tags:
 *     Tags are applied in this order:  <plural> --> <group> --> <emerge>
 *     I.e. names are merged into plurals,
 *          the troop/group name is identified, if appropriate,
 *          then the emerge message is displayed.
 *     Troops with no tags will display emerge messages as normal.
 *
 *   Troop tags go in the name of the troop; other tags go in the note box.
 *   All tag names can be customised via the plugin parameters.
 *
 * Compatibility:
 *   If using Yanfly's Battle Engine Core, load this plugin after Yanfly's.
 *   Overrides:
 *     BattleManager:     displayStartMessages
 *   Aliases:
 *     Game_Troop:        setup
 *     Window_BattleLog:  displayAddedStates, displayRemovedStates
 *
 * Terms of use:
 *   Free to use and modify.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Update log:
 *   1.0: Initial release.
 *
 * @param --- Feature Select ---
 * @text --- Feature Select ---
 * @type select
 * @desc Choose which aspects of the plugin to enable.
 *
 * @param Emerge Features
 * @text Emerge Features
 * @parent --- Feature Select ---
 * @type boolean
 * @desc If false, this plugin will not affect emerge messages.
 * @default false
 *
 * @param State Msg Features
 * @text State Msg Features
 * @parent --- Feature Select ---
 * @type boolean
 * @desc If false, this plugin will not affect state messages.
 * @default false
 *
 * @param --- Emerge Options ---
 * @text --- Emerge Options ---
 * @type select
 * @desc Options relating to the emerge message displayed on battle start.
 *
 * @param Troop Emerge
 * @text Troop Emerge
 * @parent --- Emerge Options ---
 * @type select
 * @option Always
 * @option Tagged troops only
 * @option Never
 * @desc When to use troop name in the emerge message.
 * The <group> tag takes precedence.
 * @default Tagged troops only
 *
 * @param Group Emerge Msg
 * @text Group Emerge Msg
 * @parent --- Emerge Options ---
 * @type text
 * @desc Default pattern for a <group> troop's emerge message.
 * Default: %1 and its cohort appeared!
 * @default %1 and its cohort appeared!
 *
 * @param Cull Duplicate Names
 * @text Cull Duplicate Names
 * @parent --- Emerge Options ---
 * @type boolean
 * @desc If true, show one emerge message per unique enemy name.
 * Plural names will never display twice.
 * @default true
 *
 * @param --- Tag Names ---
 * @text --- Tag Names ---
 * @type select
 * @desc Options for customising the names of this plugin's notetags.
 *
 * @param Notetag: Group Emerge
 * @text Notetag: Group Emerge
 * @parent --- Tag Names ---
 * @type text
 * @desc This tag's key/name.
 * Default: group
 * @default group
 *
 * @param Notetag: Troop Emerge Msg
 * @text Notetag: Troop Emerge Msg
 * @parent --- Tag Names ---
 * @type text
 * @desc This tag's key/name.
 * Default: emerge
 * @default emerge
 *
 * @param Notetag: Preemptive Msg
 * @text Notetag: Preemptive Msg
 * @parent --- Tag Names ---
 * @type text
 * @desc This tag's key/name.
 * Default: preemptive
 * @default preemptive
 *
 * @param Notetag: Surprise Msg
 * @text Notetag: Surprise Msg
 * @parent --- Tag Names ---
 * @type text
 * @desc This tag's key/name.
 * Default: surprise
 * @default surprise
 *
 * @param Notetag: Enemy Emerge Msg
 * @text Notetag: Enemy Emerge Msg
 * @parent --- Tag Names ---
 * @type text
 * @desc This tag's key/name.
 * Default: emerge
 * @default emerge
 *
 * @param Notetag: Plural Name
 * @text Notetag: Plural Name
 * @parent --- Tag Names ---
 * @type text
 * @desc This tag's key/name.
 * Default: plural
 * @default plural
 *
 * @param Notetag: Add State Msg
 * @text Notetag: Add State Msg
 * @parent --- Tag Names ---
 * @type text
 * @desc This tag's key/name. Use # for the state ID.
 * Default: state # add text
 * @default state # add text
 *
 * @param Notetag: Remove State Msg
 * @text Notetag: Remove State Msg
 * @parent --- Tag Names ---
 * @type text
 * @desc This tag's key/name. Use # for the state ID.
 * Default: state # rem text
 * @default state # rem text
 */

var Imported = Imported || {};			// Import namespace, var can redefine
Imported.Cae_BattleMessages = 1.0;		// Import declaration

var CAE = CAE || {};				// Author namespace, var can redefine
CAE.BattleMessages = CAE.BattleMessages || {};	// Plugin namespace

(function(_) {

'use strict';

	const EMERGE = ['always', 'tagged troops only', 'never'];
	const TAGSPLITTER = '|';		// THE ALL-MIGHTY
	const STATEID_HOLDER = '#';		// look it's a face
	const ERR_NOPARAMS = 'plugin Cae_BattleMessages.js could not find its parameters!\nEnsure you have named the plugin file correctly.';
	const WARN_PARAM = 'Check the parameters in the Plugin Manager.'
	const WARN_PARAM_STATE = 'Plugin Cae_BattleMessages.js: state ID placeholder \'' + STATEID_HOLDER + '\' not found in %1 notetag pattern!\n' + WARN_PARAM;

// ======== Parameter stuff ======== //

	_.params = PluginManager.parameters('Cae_BattleMessages');
	if (_.params === undefined) throw new Error(ERR_NOPARAMS);

	_.parseEmergeSettings = function(input) {
		let ix = EMERGE.indexOf(input.toLowerCase());
		if (ix < 0) console.error('Cae_TroopMessages.js could not parse Emerge Setting: ' + input + '.');
		return ix;
	};

	_.useEmerge	= _.params['Emerge Features'] === 'true';
	_.useStates	= _.params['State Msg Features'] === 'true';
	_.emerge	= _.parseEmergeSettings(_.params['Troop Emerge']);
	_.grpEmergeMsg	= _.params['Group Emerge Msg'] || '';
	_.dupeEmerge	= _.params['Cull Duplicate Names'] !== 'true';
	_.tags		= {	grpEmerge: _.params['Notetag: Group Emerge'] || '',
				emergeMsg: _.params['Notetag: Troop Emerge Msg'] || '',
				premptMsg: _.params['Notetag: Preemptive Msg'] || '',
				surprsMsg: _.params['Notetag: Surprise Msg'] || '',
				nmeEmgMsg: _.params['Notetag: Enemy Emerge Msg'] || '',
				pluralNom: _.params['Notetag: Plural Name'] || '',
				addStaMsg: _.params['Notetag: Add State Msg'] || '',
				remStaMsg: _.params['Notetag: Remove State Msg'] || ''	};

	if (!_.tags.addStaMsg.contains(STATEID_HOLDER)) console.warn(WARN_PARAM_STATE.format('Notetag: Add State Msg'));
	if (!_.tags.remStaMsg.contains(STATEID_HOLDER)) console.warn(WARN_PARAM_STATE.format('Notetag: Remove State Msg'));

// ============ Utility ============ //

	// Parses notetags from name of input troop database object, stores result in troop's meta property
	_.troopMetaFromName = function(troop) {
		let dummy = { note: troop.name, meta: {} };			// Fake object for extraction
		DataManager.extractMetadata(dummy);				// Apply default method
		troop.meta = troop.meta || {};					// Initialise meta property
		Object.keys(dummy.meta).forEach(function(m) {
			troop.meta[m] = dummy.meta[m];				// Transfer metadata
		});
	};

	_.troopNameWithoutTags = function(troop) {
		return troop.name.replace(/(<[^>]*>)/g, '').trim();
	};

	// Gets random entry from String text split by TAGSPLITTER, returns dFault in string format if retrieved value is ''
	_.extract = function(text, dFault) {
		let str = String(text || '').split(TAGSPLITTER);
		return str[Math.randomInt(str.length)] || dFault || '';
	};

	// Count occurrences of e in this. Used for enemy name uniqueness check (plurals)
	_.count = function(e) { return this.reduce(function(a, c) { return a += c === e ? 1 : 0; }, 0); };

	// Get enemy names, includes check for plural names
	_.enemyNames = function(troop) {
		let out = [], mem = [];
		let names = troop.movableMembers().map(function(nme) {				// Ignore hidden enemies
			return nme.originalName();						// Get enemy names including duplicates
		});
		troop.members().forEach(function(nme) {						// For all enemies in troop
			let sMe = nme.originalName();						// Get name as usual
			let seen = mem.contains(sMe);
			if (_.dupeEmerge || !seen) {						// Check for processed duplicate
				let tag = nme.enemy().meta[_.tags.pluralNom];			// Check plural tag
				let acc = _.count.call(names, sMe);				// Count same-name enemies
				let plural = tag && acc > 1;					// Plurality flag
				let name = plural ? tag.format(acc) : sMe;			// Get name singular/plural as appropriate
				let id = nme.enemyId();						// Get enemy ID, for notetag retrieval
				if (!seen || !plural) out.push({ name: name, id: id });		// Push to output unless duplicate plural
				mem.push(sMe);							// DoOnce
			}
		});
		return out;
	};

	// Returns name of group leader for group-style emerge message
	_.getGroupLeader = function(names, index) {
		let ix = index === true ? -1 : parseInt(index);
		if (isNaN(ix) || ix < 0 || ix >= names.length) {
			ix = Math.randomInt(names.length);
		}
		return names[ix].name;
	};

	// Gets the name of the meta-property associated with state 'id'
	_.tagFormatStateId = function(type, id) {
		switch (type) {
			case 'add':	return _.tags.addStaMsg.replace(STATEID_HOLDER, id);
			case 'rem':	return _.tags.remStaMsg.replace(STATEID_HOLDER, id);
			default:	return '';
		}
	};

	// Get relevant state objects for metadata retrieval
	_.getTaggedStates = function(type, meta) {
		let out = [];
		for (let n = 1; n < $dataStates.length; n++) {		// Entry 0 is null >_>
			if (meta[_.tagFormatStateId(type, n)]) {
				out.push($dataStates[n]);
			}
		}
		return out;
	};

	_.getStateMsgProp = function(type, isActor) {
		switch (type) {
			case 'add':	return 'message' + (isActor ? '1' : '2');
			case 'rem':	return 'message4';
			default:	return '';			// unknown
		}
	};

	// Changes state messages for relevant states according to notetags
	_.adjustStateMsgs = function(type, batt) {
		if (['add', 'rem'].contains(type)) {
			let isActor = batt.isActor();
			let daBatt = isActor ? batt.actor() : batt.enemy();
			let prop = _.getStateMsgProp(type, isActor);
			let states = _.getTaggedStates(type, daBatt.meta);
			let isOK = states.length > 0;
			let mem = [];
			if (isOK) {
				states.forEach(function(s) {				// Order-certain
					let p = _.tagFormatStateId(type, s.id);		// Get tag key
					let str = _.extract(daBatt.meta[p]);		// Get tag value
					mem.push(s[prop]);				// Remember
					s[prop] = str;					// Reassign
				});
			}
			return { k: isOK, s: states, r: mem, p: prop };			// Used for restore
		}
		return;		// Unknown input
	};

	// Restores original database values based on input "memory" object
	_.restoreStateMsgs = function(o) { if (o && o.k) o.s.forEach(function(s, n) { s[o.p] = o.r[n]; }); };

// ========== Alterations ========== //

	(function() { if (!_.useStates) return;

		// Alias battle log window methods to edit the relevant $dataStates entries before/after callback

		_.Window_BattleLog_displayAddedStates = Window_BattleLog.prototype.displayAddedStates;
		Window_BattleLog.prototype.displayAddedStates = function(target) {
			let tmp = _.adjustStateMsgs('add', target);				// Overwrite
			_.Window_BattleLog_displayAddedStates.call(this, target);		// Callback
			_.restoreStateMsgs(tmp);						// Restore
		};

		_.Window_BattleLog_displayRemovedStates = Window_BattleLog.prototype.displayRemovedStates;
		Window_BattleLog.prototype.displayRemovedStates = function(target) {
			let tmp = _.adjustStateMsgs('rem', target);				// Overwrite
			_.Window_BattleLog_displayRemovedStates.call(this, target);		// Callback
			_.restoreStateMsgs(tmp);						// Restore
		};

	})();

	(function() { if (!_.useEmerge) return;

		// Transfer tags in troop name to troop's meta property
		_.Game_Troop_setup = Game_Troop.prototype.setup;
		Game_Troop.prototype.setup = function(troopId) {
			_.Game_Troop_setup.call(this, troopId);
			_.troopMetaFromName(this.troop());
		};

		// Override and massively extend emerge message method
		BattleManager.displayStartMessages = function() {
			let daTroop = $gameTroop.troop();
			let troopName = _.troopNameWithoutTags(daTroop);
			let names = _.enemyNames($gameTroop);		// <-- includes plurals
			let group = _.extract(daTroop.meta[_.tags.grpEmerge]);
			let strE = _.extract(daTroop.meta[_.tags.emergeMsg]);
			let strP = _.extract(daTroop.meta[_.tags.premptMsg], TextManager.preemptive);
			let strS = _.extract(daTroop.meta[_.tags.surprsMsg], TextManager.surprise);
			let outE = [];
			console.log(group);
			if (group) {
				if (!strE) strE = _.grpEmergeMsg;
				outE.push(strE.format(_.getGroupLeader(names, group)));
			} else {
				switch (_.emerge) {
					case 0:		// troop name
						if (!strE) strE = TextManager.emerge;
						outE.push(strE.format(troopName));
						break;
					case 1:		// troop name for tagged troops only
						if (strE) {
							outE.push(strE.format(troopName));
							break;
						} // else fall-through
					default:
						if (!strE) strE = TextManager.emerge;
						names.forEach(function(name) {
							let nme = $dataEnemies[name.id];
							let emg = _.extract(nme.meta[_.tags.nmeEmgMsg], strE);
							outE.push(emg.format(name.name));
						});
				}
			}
			outE.forEach(function(msg) { if (msg) $gameMessage.add(msg); });
			if (this._preemptive && strP) {
				$gameMessage.add(strP.format($gameParty.name()));
			} else if (this._surprise && strS) {
				$gameMessage.add(strS.format($gameParty.name()));
			}
		};

	})();

})(CAE.BattleMessages);