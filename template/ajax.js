/* global phpbb */

(function($) {  // Avoid conflicts with other libraries

'use strict';

// This callback will mark all forum icons read
phpbb.addAjaxCallback('mark_forums_read', function(res) {
	var readTitle = res.NO_UNREAD_POSTS;
	var unreadTitle = res.UNREAD_POSTS;
	var iconsArray = {
		forum_unread: 'forum_read',
		forum_unread_subforum: 'forum_read_subforum',
		forum_unread_locked: 'forum_read_locked'
	};

	$('div').find('.bg-primary\\/10').each(function() {
		var $this = $(this);
		$this.removeClass('bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light')
			 .addClass('bg-slate-100 text-slate-400 dark:bg-slate-700/50 dark:text-slate-400');

		var $icon = $this.children('span.material-symbols-outlined');
		if ($icon.text() === 'forum') {
			$icon.text('chat_bubble');
		}

		// Remove unread badge dot indicator next to the icon
		$this.siblings('span.bg-primary').remove();
	});

	// Remove border highlighting for unread forums
	$('div.border-primary\\/30').each(function() {
		$(this).removeClass('border-primary/30 dark:border-primary/50');
	});

	// Mark subforums read (Tailwind specific, relying on text-primary font-bold)
	$('a.text-primary.font-bold[href*="f="]').each(function() {
		$(this).removeClass('font-bold text-primary dark:text-primary-light')
			   .addClass('font-medium text-slate-600 dark:text-slate-300'); // normal subforum styling read state
	});

	// Mark topics read if we are watching a category and showing active topics
	if ($('#active_topics').length) {
		phpbb.ajaxCallbacks.mark_topics_read.call(this, res, false);
	}

	// Update mark forums read links
	$('[data-ajax="mark_forums_read"]').attr('href', res.U_MARK_FORUMS);

	phpbb.closeDarkenWrapper(3000);
});

/**
* This callback will mark all topic icons read
*
* @param {bool} [update_topic_links=true] Whether "Mark topics read" links
* 	should be updated. Defaults to true.
*/
phpbb.addAjaxCallback('mark_topics_read', function(res, updateTopicLinks) {
	var readTitle = res.NO_UNREAD_POSTS;
	var unreadTitle = res.UNREAD_POSTS;
	var iconsArray = {
		global_unread: 'global_read',
		announce_unread: 'announce_read',
		sticky_unread: 'sticky_read',
		topic_unread: 'topic_read'
	};
	var iconsState = ['', '_hot', '_hot_mine', '_locked', '_locked_mine', '_mine'];
	var unreadClassSelectors;
	var classMap = {};
	var classNames = [];

	if (typeof updateTopicLinks === 'undefined') {
		updateTopicLinks = true;
	}

	// Update all unread topic card borders
	$('div.border-primary\\/30').each(function() {
		$(this).removeClass('border-primary/30 dark:border-primary/50');
	});

	// Update topic titles (remove bold & primary color from unread links)
	$('a.text-primary.font-bold').each(function() {
		$(this).removeClass('text-primary font-bold dark:text-primary-light')
			   .addClass('text-slate-800 font-semibold dark:text-slate-200');
	});

	// Update the icons inside the topic list (change them from unread color back to slate, and the icon text)
	$('div.bg-primary\\/10').filter(function() {
		return $(this).find('.material-symbols-outlined').length > 0;
	}).each(function() {
		$(this).removeClass('bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light')
			   .addClass('bg-slate-100 text-slate-400 dark:bg-slate-700/50 dark:text-slate-400');
		
		var $icon = $(this).find('.material-symbols-outlined');
		if ($icon.text() === 'chat') {
			$icon.text('chat_bubble'); // or the icon used for read topic
		}

		// Remove unread badge dot indicator next to the icon
		$(this).siblings('span.bg-primary').remove();
	});

	// Remove unread badges absolute dot markers
	$('.absolute.-bottom-1.-right-1.bg-primary').remove();

	// Update mark topics read links
	if (updateTopicLinks) {
		$('[data-ajax="mark_topics_read"]').attr('href', res.U_MARK_TOPICS);
	}

	phpbb.closeDarkenWrapper(3000);
});

// This callback will mark all notifications read
phpbb.addAjaxCallback('notification.mark_all_read', function(res) {
	if (typeof res.success !== 'undefined') {
		phpbb.markNotifications($('#notification_list li.bg2'), 0);
		phpbb.toggleDropdown.call($('#notification_list_button'));
		phpbb.closeDarkenWrapper(3000);
	}
});

// This callback will mark a notification read
phpbb.addAjaxCallback('notification.mark_read', function(res) {
	if (typeof res.success !== 'undefined') {
		var unreadCount = Number($('#notification_list_button strong').html()) - 1;
		phpbb.markNotifications($(this).parent('li.bg2'), unreadCount);
	}
});

/**
 * Mark notification popup rows as read.
 *
 * @param {jQuery} $popup jQuery object(s) to mark read.
 * @param {int} unreadCount The new unread notifications count.
 */
phpbb.markNotifications = function($popup, unreadCount) {
	// Remove the unread status.
	$popup.removeClass('bg2 bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20')
		  .addClass('hover:bg-slate-50 dark:hover:bg-slate-800/50');
	
	// Update inner elements to look read
	$popup.find('.notification-avatar-wrap')
		  .removeClass('ring-primary/30')
		  .addClass('ring-transparent border border-slate-200 dark:border-slate-700');
		  
	$popup.find('.notification-title')
		  .removeClass('font-bold')
		  .addClass('font-medium');

	$popup.find('a.mark_read').remove();

	// Update the notification link to the real URL.
	$popup.each(function() {
		var link = $(this).find('a.notification-block');
		if (link.length) {
			link.attr('href', link.attr('data-real-url'));
		}
	});

	// Update the unread count.
	$('strong', '#notification_list_button').html(unreadCount);
	// Remove the Mark all read link and hide notification count if there are no unread notifications.
	if (!unreadCount) {
		$('#mark_all_notifications').remove();
		$('#notification_list_button > strong').addClass('hidden');
	}

	// Update page title
	var $title = $('title');
	var originalTitle = $title.text().replace(/(\((\d+)\))/, '');
	$title.text((unreadCount ? '(' + unreadCount + ')' : '') + originalTitle);
};

// This callback finds the post from the delete link, and removes it.
phpbb.addAjaxCallback('post_delete', function() {
	var $this = $(this),
		postId;

	if ($this.attr('data-refresh') === undefined) {
		postId = $this[0].href.split('&p=')[1];
		var post = $this.closest('article[id="p' + postId + '"]').css('pointer-events', 'none');
		
		post.fadeOut(function() {
			$(this).remove();
		});
	}
});

// This callback removes the approve / disapprove div or link.
phpbb.addAjaxCallback('post_visibility', function(res) {
	var remove = (res.visible) ? $(this) : $(this).closest('article[id^="p"]');
	$(remove).css('pointer-events', 'none').fadeOut(function() {
		$(this).remove();
	});

	if (res.visible) {
		// Remove the "Deleted by" message from the post on restoring.
		remove.closest('article[id^="p"]').find('[id^="post_hidden"]').css('pointer-events', 'none').fadeOut(function() {
			$(this).remove();
		});
	}
});

// This removes the parent row of the link or form that fired the callback.
phpbb.addAjaxCallback('row_delete', function() {
	$(this).parents('tr').remove();
});

// This handles friend / foe additions removals.
phpbb.addAjaxCallback('zebra', function(res) {
	var zebra;

	if (res.success) {
		zebra = $('.zebra');
		zebra.first().html(res.MESSAGE_TEXT);
		zebra.not(':first').html('&nbsp;').prev().html('&nbsp;');
	}
});

/**
 * This callback updates the poll results after voting.
 * Optimized for MobilePro Tailwind theme.
 */
phpbb.addAjaxCallback('vote_poll', function(res) {
	if (typeof res.success !== 'undefined') {
		var poll = $(this).closest('.topic_poll');
		var mostVotes = 0;

		// Check visibility status using our new Tailwind-compatible selectors
		var resultsVisible = poll.find('.poll-option:first .resultbar').is(':visible');

		// Hide "View results" link
		if (!resultsVisible) {
			poll.find('.poll_view_results').hide(500);
		}

		if (!res.can_vote) {
			// If can't vote anymore, hide inputs and show results
			poll.find('.polls, .poll_max_votes, .poll_vote, .poll_option_select').fadeOut(500, function () {
				poll.find('.resultbar, .poll_option_percent, .poll_total_votes').fadeIn().css('display', 'flex');
			});
		} else {
			// Still can vote, just show the hidden result bars
			poll.find('.resultbar, .poll_option_percent, .poll_total_votes').fadeIn().css('display', 'flex');
		}

		// Calculate most votes for relative bar sizing
		poll.find('[data-poll-option-id]').each(function() {
			var optionId = $(this).attr('data-poll-option-id');
			mostVotes = (res.vote_counts[optionId] >= mostVotes) ? res.vote_counts[optionId] : mostVotes;
		});

		// Update total votes counter
		poll.find('.poll_total_vote_cnt').html(res.total_votes);

		// Process each option
		poll.find('[data-poll-option-id]').each(function() {
			var $this = $(this);
			var optionId = $this.attr('data-poll-option-id');
			var voted = (typeof res.user_votes[optionId] !== 'undefined');
			var mostVoted = (res.vote_counts[optionId] === mostVotes && mostVotes > 0);
			var percent = (!res.total_votes) ? 0 : Math.round((res.vote_counts[optionId] / res.total_votes) * 100);
			var percentRel = (mostVotes === 0) ? 0 : Math.round((res.vote_counts[optionId] / mostVotes) * 100);

			// Update title and classes
			var altText = $this.attr('data-alt-text');
			$this.attr('title', voted ? $.trim(altText) : '');
			$this.toggleClass('voted', voted);
			$this.toggleClass('most-votes', mostVoted);

			// Animate the actual bar (.poll-bar)
			var $bar = $this.find('.poll-bar');
			var barTimeLapse = (res.can_vote) ? 500 : 1500;

			setTimeout(function () {
				$bar.animate({ width: percentRel + '%' }, 500);

				// Tailwind Color Management
				if (mostVoted) {
					$bar.removeClass('bg-slate-400 dark:bg-slate-500').addClass('bg-primary');
				} else {
					$bar.removeClass('bg-primary').addClass('bg-slate-400 dark:bg-slate-500');
				}

				var percentText = percent ? percent + '%' : res.NO_VOTES;
				$this.find('.poll_option_percent').html(percentText);
				
				// Update result count text
				$this.find('.resultbar > div:last-child').html(res.vote_counts[optionId]);
			}, barTimeLapse);
		});

		if (!res.can_vote) {
			poll.find('.polls').delay(400).fadeIn(500);
		}

		// Show success message
		var confirmationDelay = (res.can_vote) ? 300 : 900;
		poll.find('.vote-submitted').delay(confirmationDelay).slideDown(200, function() {
			$(this).delay(5000).fadeOut(500);
		});
	}
});

/**
 * Show poll results when clicking "View results" link.
 */
$('.poll_view_results a').on('click', function(e) {
	e.preventDefault();
	var $poll = $(this).closest('.topic_poll');
	$poll.find('.resultbar, .poll_option_percent, .poll_total_votes').fadeIn().css('display', 'flex');
	$poll.find('.poll_view_results').hide(500);
});


$('[data-ajax]').each(function() {

	var $this = $(this);
	var ajax = $this.attr('data-ajax');
	var filter = $this.attr('data-filter');

	if (ajax !== 'false') {
		var fn = (ajax !== 'true') ? ajax : null;
		filter = (filter !== undefined) ? phpbb.getFunctionByName(filter) : null;

		phpbb.ajaxify({
			selector: this,
			refresh: $this.attr('data-refresh') !== undefined,
			filter: filter,
			callback: fn
		});
	}
});

/**
 * This simply appends #preview to the action of the
 * QR action when you click the Full Editor & Preview button
 */
$('#qr_full_editor').click(function() {
	$('#qr_postform').attr('action', function(i, val) {
		return val + '#preview';
	});
});


/**
 * Make the display post links to use JS
 */
$('.display_post').click(function(e) {
	// Do not follow the link
	e.preventDefault();

	var postId = $(this).attr('data-post-id');
	$('#post_content' + postId).show();
	$('#profile' + postId).show();
	$('#post_hidden' + postId).hide();
});

/**
 * Display hidden post on post review page
 */
$('.display_post_review').on('click', function(e) {
	e.preventDefault();

	let $displayPostLink = $(this);
	$displayPostLink.closest('.post-ignore').removeClass('post-ignore');
	$displayPostLink.hide();
});

/**
* Toggle the member search panel in memberlist.php.
*
* If user returns to search page after viewing results the search panel is automatically displayed.
* In any case the link will toggle the display status of the search panel and link text will be
* appropriately changed based on the status of the search panel.
*/
$('#member_search').click(function () {
	var $memberlistSearch = $('#memberlist_search');

	$memberlistSearch.slideToggle('fast');
	phpbb.ajaxCallbacks.alt_text.call(this);

	// Focus on the username textbox if it's available and displayed
	if ($memberlistSearch.is(':visible')) {
		$('#username').focus();
	}
	return false;
});

/**
* Automatically resize textarea
*/
$(function() {
	var $textarea = $('textarea:not(#message-box textarea, .no-auto-resize)');
	phpbb.resizeTextArea($textarea, { minHeight: 75, maxHeight: 250 });
	phpbb.resizeTextArea($('textarea', '#message-box'));
});


})(jQuery); // Avoid conflicts with other libraries
