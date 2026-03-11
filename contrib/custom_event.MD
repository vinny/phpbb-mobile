# Custom Template Events - MobilePro

To give extension developers high flexibility in modifying the mobile-first layouts without altering core HTML files, **MobilePro** includes a range of bespoke custom phpBB template events. 

If you are developing or modifying an extension, you can inject your own template definitions in these hooks.

## 1. Top Header Quick Actions (`overall_header.html`)
These events let you inject new buttons/actions into the top-right quick actions block (where Search and Notifications are located).

* `overall_header_quick_actions_prepend`: Before the very first quick action item.
* `overall_header_quick_actions_search_before`: Immediately before the Search button.
* `overall_header_quick_actions_search_after`: Immediately after the Search button.
* `overall_header_quick_actions_notifications_before`: Immediately before the Notifications button.
* `overall_header_quick_actions_notifications_after`: Immediately after the Notifications button.
* `overall_header_quick_actions_theme_toggle_before`: Immediately before the Dark/Light theme toggle button.
* `overall_header_quick_actions_theme_toggle_after`: Immediately after the Dark/Light theme toggle button.
* `overall_header_quick_actions_append`: After the very last quick action item.

## 2. Fixed Footer Navigation (`navbar_footer.html`)
These events relate to the fixed bottom navigation bar present on mobile screens.

* `navbar_footer_prepend`: Inside the navigation bar, right at the start.
* `navbar_footer_home_before`: Before the "Home" icon.
* `navbar_footer_home_after`: After the "Home" icon.
* `navbar_footer_center_before`: Before the center avatar/login icon.
* `navbar_footer_center_after`: After the center avatar/login icon.
* `navbar_footer_settings_before`: Before the settings/register icon.
* `navbar_footer_settings_after`: After the settings/register icon.
* `navbar_footer_append`: Inside the navigation bar, right at the end.

## 3. Side Navigation Drawer (`navbar_mobile.html`)
These events manage the slide-out navigation menu for mobile users.

* `navbar_mobile_overlay_before`: Immediately before the dark overlay backdrop.
* `navbar_mobile_drawer_prepend`: At the top of the open drawer, right after the main header block.
* `navbar_mobile_profile_before`: Before the user profile block (where the avatar/name sits).
* `navbar_mobile_profile_after`: After the user profile block.
* `navbar_mobile_main_nav_prepend`: At the top of the "Forum Index" links group.
* `navbar_mobile_main_nav_append`: At the bottom of the "Forum Index" links group.
* `navbar_mobile_user_nav_prepend`: At the top of the "Profile" links group.
* `navbar_mobile_user_nav_append`: At the bottom of the "Profile" links group.
* `navbar_mobile_info_nav_prepend`: At the top of the "Information" links group.
* `navbar_mobile_info_nav_append`: At the bottom of the "Information" links group.
* `navbar_mobile_drawer_append`: At the very bottom of the drawer content, right before the drawer closes.
* `navbar_mobile_script_after`: Right after the initialization `<script>` tags for the drawer.
