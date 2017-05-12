## What's shakin' bakin'?




---

### Arch Linux setup notes
> TODO: Add links to docs

- Current development environment:
    - Distro: Arch Linux
    - Window Manager: i3
    - Desktop environment: Nil
    - Terminal Emulator: rxvt-unicode
    - Status bar: bumblebee
    - Screen locker: i3lock
    - Editor: Vim(Duh!)
    - Tmux to multiplex, of course!
    - Network manager: wpa_supplicant
	- Desktop integration: xdg-utils(for open and what not)
	- Image viewer: gthumb
	- IRC: hexchat
	- pdf viewer: zathura with zathura-pdf-poppler(it comes with vim bindings!!)
-  Networking: I use wpa_supplicant and to get the IP dhcpcd. During installation use iw and wpa_supplicant. Once it is setup, use dhcpcd hook to start wpa_supplicant. The connections defined inside the conf file(to be created in the /etc/wpa_supplicant directory) gets connected to automatically on boot. To scan for new connections use wpa_cli. [Refer docs](https://wiki.archlinux.org/index.php/WPA_supplicant#Advanced_usage)
- i3 reads from ~/.config/i3/config file and uxrvt reads confs from ~/.Xresources.
- To load i3, the flow of process calls is:
	- Operating systems boots up and loads getty. Once you give in username and password, it calls the preferred shell of that user(zsh, bash, etc.).
	- Now when that shell process is started, we have to start the X window system. The command for this is startx. So exec startex inside bash_profile, zprofile, or the similar start up conf file for the shell.
	- Now we have to load i3. We will load it as soon as x window system starts up. So echo 'exec i3' inside ~/.xinitrc.
	- You can launch the terminal emulator using the $Mod+Enter. The terminal emulator is chosen by i3 from the file /usr/sbin/i3-sensible-terminal. So install one from the list defined in that file. Uxrvt is the most preferred one apparently. It reads confs from ~/.Xresources and ~/.Xdefaults.
- Getting sound system to work: This was a bit tricky mostly because of the confusing documentation.  You need a hardware support and then a usermod application(sound server). The most widely used hardware support is alsa. Packages needed are: alsa, alsa-utils, and alsa-plugins. Once downloaded, you will have to unmute the sound card's Master volume. This one did not work for me for a very long time. Turned out I was trying to turn the wrong sound card on. Specify -c 2 when you run the sset command to unmute. Otherwise just use alsamixer, switch the sounds cards and manually increase the volume. Looks like I will have to do this everytime I switch from speaker to headphone. Also, I used a script to amplify the alsa volume. Make sure you add the user to audio and video groups.
- To mount iphone in arch(for file backup and what not) use [this reddit thread](https://www.reddit.com/r/archlinux/comments/3l2gvo/eli5_how_to_mount_my_iphone_in_arch/)
- To use a new font for i3 or uxrvt in general you'll have to install ttf-<font name> package. I haven't yet figured out how to increase the size of the text in uxrvt. I am clearly missing something.



*Nandaja*

*May 11, 2017*

---
