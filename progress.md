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
    - application launcher: dmenu. Mapped by default to $Mod+d
-  Networking: I use wpa_supplicant and to get the IP dhcpcd. During installation use iw and wpa_supplicant. Once it is setup, use dhcpcd hook to start wpa_supplicant. The connections defined inside the conf file(to be created in the /etc/wpa_supplicant directory) gets connected to automatically on boot. To scan for new connections use wpa_cli. [Refer docs](https://wiki.archlinux.org/index.php/WPA_supplicant#Advanced_usage)
- i3 reads from ~/.config/i3/config file and uxrvt reads confs from ~/.Xresources.
- To load i3, the flow of process calls is:
	- Operating systems boots up and loads getty. Once you give in username and password, it calls the preferred shell of that user(zsh, bash, etc.).
	- Now when that shell process is started, we have to start the X window system. The command for this is startx. So exec startex inside bash_profile, zprofile, or the similar start up conf file for the shell.
	- Now we have to load i3. We will load it as soon as x window system starts up. So echo 'exec i3' inside ~/.xinitrc.
	- You can launch the terminal emulator using the $Mod+Enter. The terminal emulator is chosen by i3 from the file /usr/sbin/i3-sensible-terminal. So install one from the list defined in that file. Uxrvt is the most preferred one apparently. It reads confs from ~/.Xresources and ~/.Xdefaults.
- Getting sound system to work: This was a bit tricky mostly because of the confusing documentation.  You need a hardware support and then a usermod application(sound server). The most widely used hardware support is alsa. Packages needed are: alsa, alsa-utils, and alsa-plugins. Once downloaded, you will have to unmute the sound card's Master volume. This one did not work for me for a very long time. Turned out I was trying to turn the wrong sound card on. Specify -c 2 when you run the sset command to unmute. Otherwise just use alsamixer, switch the sounds cards and manually increase the volume. Looks like I will have to do this everytime I switch from speaker to headphone. Also, I used a script to amplify the alsa volume. Make sure you add the user to audio and video groups.
- To mount iphone in arch(for file backup and what not) use [this reddit thread](https://www.reddit.com/r/archlinux/comments/3l2gvo/eli5_how_to_mount_my_iphone_in_arch/)
- Getting a wireless printers working: Packages installed were cups, cups-pdf, avahi, and its dependencies. Once installed start and enable avahi-daemon.service and  org.cups.cupsd.service. Use the web interface at localhost:641 and add a printer and what not. I was using the cups cli and had difficulty connecting to the printer. lpinfo -v lists all the available printers and lpinfo -m lists the drivers.
- To take screenshots, I installed gscreenshot which is a wrapper around scrot. I mapped gscreenshot-cli to the key binding Mod1+Shift+s in my i3 config. Works like a charm.
- Customizing the touchpad: I found the lack of click on tap quite irritating and turns out it was pretty easy to customize. The tool used by Xorg for this is xinput. If you run the command:

`xinput set-prop "SynPS/2 Synaptics TouchPad" "libinput Tapping Enabled" 1`

the click on tap feature will be enabled. To explore more options try,

`xinput list-props "SynPS/2 Synaptics TouchPad"`

I added this command to ~/.config/i3/config for this to happen on startup:

`exec --no-startup-id xinput set-prop "SynPS/2 Synaptics Touchpad"
"Synaptics Tap Time" 0`

I got to know the touchpad device name from running `xinput`.

- Things yet to figure out(Edit: Not anymore. Refer the updates below)
    - To use a new font for i3 or uxrvt in general you'll have to install ttf-<font name> package. I haven't yet figured out how to increase the size of the text in uxrvt. I am clearly missing something.
    - For some reason I can't set my cursor to be a vertical line or
      block on vim. This combined with the issue mentioned above make it extremely  difficult to understand where my cursor is at the moment.

**Update**: So magically today urxvt stopped the strike and decided to
present itself in my favorite terminal font(FYI, Inconsolata). Also, my
vim now has a bright red blinking vertical cursor block! All I had to do
was to create a ~/.Xdefaults file with content the same as that of
~/.Xresources. So weird... I thought either of these files would do the
trick.

**Edit**: Just realised I didn't set the special buttons up properly. It is a bit fancy, once you get used to setting everything from the terminal I guess. But would be great to get it working. Looking at you, Dom!

*Nandaja*

*May 11, 2017*

---

![ssh pranking](/assets/images/arewedoingthis.png)

### `ssh`ing behind NATs!

**goal**:

> to be able to `ssh` into each other's computer NO MATTER WHERE WE ARE. Ideally, our computers would run a daemon whenever they wake up that effectively opens them up to the other persons computer automatically.

Until now we've been happily `ssh`ing each other through our own LAN, but now its the real-world and we ain't got no public IPs no mo'. I'm stuck behind RC's and Nandaja somewhere behind some hot and sweaty network in India...

Enter Linus...

![linus.png](/assets/images/linus.png)

On some undisclosed island in the middle of the Pacific Ocean we acquired a little server, Linus. Linus, that lucky guy, has a public IP. After many dropped Skype calls, we finally managed to set up a two-way `ssh` tunnel through him. What a guy!

Here is the setup:

```sh
# For Dom to open up to Nandaja
dom $ ssh -f -N -R 1770:localhost:22 root@<Linus_pub_IP>

# Now Nandaja can ssh into Dom
nandaja $ ssh root@<Linus_pub_IP>
nandaja $ ssh dom@localhost -p 1770
# OR with only one command:
nandaja $ ssh -tt root@<Linus_pub_IP> ssh dom@localhost -p 1770

# Now Nandaja opens up to Dom
nandaja $ ssh -f -N -R 2012:localhost:22 root@<Linus_pub_IP>

# and Dom can ssh into Nandaja
dom $ ssh root@<Linus_pub_IP>
dom $ ssh nandaja@localhost -p 2012
# OR with only one command
dom $ ssh -tt root@<Linus_pub_IP> ssh nandaja@localhost -p 2012
```

The setup requires some `ssh` key juggling first:
```sh
# All three computers need to have ssh keys (dom, nandaja, root@Linus)
$ ssh-keygen

# Nandaja and Dom need to give root@Linus their public keys, and Linus needs to give them both its public key as well
dom $ ssh-copy-id root@<Linus_pub_IP>
dom $ ssh -f -N -R 1770:localhost:22 root@<Linux_pub_IP>
root@Linus $ ssh-copy-id dom@localhost -p 1770

nandaja $ ssh-copy-id root@<Linus_pub_IP>
nandaja $ ssh -f -N -R 2012:localhost:22 root@<Linus_pub_IP>
root@Linus $ ssh-copy-id nandaja@localhost -p 2012
```

Let the `ssh`-ing begin!

*Dominic*

*May 16, 2017*

---

![serious face](/assets/images/strace.png)

### Dissecting linux syscalls with `strace` and patience

We got a soft spot for syscalls. Not sure why -- maybe its the because its like learning to speak the kernel's language. Today we crossed off "`strace` some program" from our bucket list... sortof.

Sortof because we only scratched the surface of syscalls, and realized by the end of our dissection, we only dissected the syscalls that runs at the startup of basically any program! Queue the music:

*the program*: attempts to use the `open` syscall to open a nonexistant file
```C
#include<sys/stat.h>
#include<fcntl.h>

void main(void){
  int ret = open("nothere.txt", O_RDONLY);
 return;
}
```

The strace barf:
```sh
$ strace a.out
execve("./a.out", ["./a.out"], [/* 24 vars */]) = 0
brk(NULL)                               = 0xf78000
access("/etc/ld.so.preload", R_OK)      = -1 ENOENT (No such file or directory)
open("/etc/ld.so.cache", O_RDONLY|O_CLOEXEC) = 3
fstat(3, {st_mode=S_IFREG|0644, st_size=110204, ...}) = 0
mmap(NULL, 110204, PROT_READ, MAP_PRIVATE, 3, 0) = 0x7fadae54c000
close(3)                                = 0
open("/usr/lib/libc.so.6", O_RDONLY|O_CLOEXEC) = 3
read(3, "\177ELF\2\1\1\3\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0000\6\2\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=1977568, ...}) = 0
mmap(NULL, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7fadae54a000
mmap(NULL, 3815728, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7fadadfa1000
mprotect(0x7fadae13c000, 2093056, PROT_NONE) = 0
mmap(0x7fadae33b000, 24576, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x19a000) = 0x7fadae33b000
mmap(0x7fadae341000, 14640, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7fadae341000
close(3)                                = 0
arch_prctl(ARCH_SET_FS, 0x7fadae54b440) = 0
mprotect(0x7fadae33b000, 16384, PROT_READ) = 0
mprotect(0x600000, 4096, PROT_READ)     = 0
mprotect(0x7fadae567000, 4096, PROT_READ) = 0
munmap(0x7fadae54c000, 110204)          = 0
open("nothere.txt", O_RDONLY)           = -1 ENOENT (No such file or directory)
exit_group(-1)                          = ?
+++ exited with 255 +++
```

*At least 22 syscalls everytime you run a program!* That's 22 times this user program pokes the kernel "would you do this for me?". Talk about needy...

And here's a list of all the unique syscalls made in the course of the is program (in order of first appearance):
```sh
execve
brk
access
open
fstat
mmap
close
read
mprotect
arch_prctl
munmap
exit_group
```

After much `man` page hunting (careful! sometimes you need to say the secion of man pages for the command you're looking for -- it might have multiple -- n.b. the secion for syscalls is 2`) we managed a to tease out what the program is doing based on what it is asking the kernel to do.

** Replacing the current image process **

First, `execve` is used to replace the current process image with a new image given from an executable file, in this case `a.out`. Note that the many variables not listed in the arguments are actually just the environment variables getting passed to the program. Then, we "bork" some memory space for the new process image (i.e. setting a new "program *break*" for the process, which is the first location after the end of the uninitialized data segment), passing `NULL` just lets the kernel decide how much memory to bork.

** Pulling in the loader **

Then we get into the *loader*, `ld.so`. First, we try to `access` in the easiest way possible, from some "preloaded" file, but here we fail. So, we do the next best thing and up the file from a "cached" version of it. It is given the file descriptor, 3. `fstat` peaks into the metadata associated with this file in it's inode. We can see it's located on `dev(8, 1)`, which happens to be our main storage device. We can see how big it is, permissions, and whatnot. This information is used to know how much memory to `mmap` (memory-map) for it, in this case, 110204 bytes. We then `close` it up.

** Pulling in lib.c **

Next we `open` up *`lib.c`*. In this case, we actually `read` the file in (notice it is re-allocated the file descriptor number 3, remember 0, 1, 2 are reserved for standard in, out, and error). The string printed in the call to `read` is the beginning of the file, and we read in here just enough to get the meta-data for the library. Then, we `fstat` it, and `mmap` some space for the rest of the library (two calls here due to different read/write permissions for parts of the library. Further, we `mprotect` some of the library by making sure the process cannot access it (`PROT_NONE`).

Next we `mmap` some space not associated to any particular file (i.e. the file descriptor is `-1`). The call to `arch_prctl` "sets the architecture-specific thread state", in this case setting the 64-bit base for the FS register to the address given. A few more manipulations of read/write priveliges with `mprotect` "sets the architecture-specific thread state", in this case setting the 64-bit base for the FS register to the address given. A few more manipulations of read/write priveliges with `mprotect`, and we wrap up the setup by `munmap`ing the addresses associated with the loader we brought in at the beginning of execution.

** Actually starting our program **

*We begin our program* with `open` and promptly fail (the -1 return code), and throw up our hands with `exit_group` with the given error. Of course, we were expecting this, as `nothere.txt` was a file that didn't exist when the program was run.

#### Epilogue: memory layout of the program

Since much of the `strace` output referenced different memory locations, we wanted to get a better idea of what it meant. So, we recompiled our broken program to have some `-ggdb` symbol table, and `gdb`'d it to break in the midst of running. Then we could look at its memory layout via Unix's beautiful file-interface for it (`/proc/[proc_id]/maps`).

```sh
$ cat /proc/[proc_id]/maps
00400000-00401000 r-xp 00000000 08:03 6160791                            /home/domspad/a.out
00600000-00601000 r--p 00000000 08:03 6160791                            /home/domspad/a.out
00601000-00602000 rw-p 00001000 08:03 6160791                            /home/domspad/a.out
7ffff7a36000-7ffff7bd1000 r-xp 00000000 08:01 395388                     /usr/lib/libc-2.25.so
7ffff7bd1000-7ffff7dd0000 ---p 0019b000 08:01 395388                     /usr/lib/libc-2.25.so
7ffff7dd0000-7ffff7dd4000 r--p 0019a000 08:01 395388                     /usr/lib/libc-2.25.so
7ffff7dd4000-7ffff7dd6000 rw-p 0019e000 08:01 395388                     /usr/lib/libc-2.25.so
7ffff7dd6000-7ffff7dda000 rw-p 00000000 00:00 0
7ffff7dda000-7ffff7dfd000 r-xp 00000000 08:01 395389                     /usr/lib/ld-2.25.so
7ffff7fd9000-7ffff7fdb000 rw-p 00000000 00:00 0
7ffff7ff8000-7ffff7ffa000 r--p 00000000 00:00 0                          [vvar]
7ffff7ffa000-7ffff7ffc000 r-xp 00000000 00:00 0                          [vdso]
7ffff7ffc000-7ffff7ffd000 r--p 00022000 08:01 395389                     /usr/lib/ld-2.25.so
7ffff7ffd000-7ffff7ffe000 rw-p 00023000 08:01 395389                     /usr/lib/ld-2.25.so
7ffff7ffe000-7ffff7fff000 rw-p 00000000 00:00 0
7ffffffde000-7ffffffff000 rw-p 00000000 00:00 0                          [stack]
ffffffffff600000-ffffffffff601000 r-xp 00000000 00:00 0                  [vsyscall]
```

It's up to the reader to estimate the references in the syscalls to memory addresses with the memory layout seen here. This is where the patience is necessary...

Another 4-hour skype, another day...

*Dominic*

*May 21, 2017*

---
![aphrodesiac?](/assets/images/garlic_man.png)

### GARLIC

Some say garlic is an aphrodesiac. I'd like to believe that.

*Dominic*

*June 6, 2017*

UPDATE: I haven't seen my garlic man for over a month! Can you believe that?!

*Nandaja*

*June 11, 2017*


---



### Finally, some RC-ers were fortunate enough to watch ICMPB_and_J in action



An amazing week happened! We made our ICMP chat functional spending long
hours working on it for a week. Even Jitsi gave up hope at one point,
but we didn't...

This wouldn't have been possible without:
* Linus! One sweet fella...
* [Iodine](http://code.kryo.se/iodine/). We don't know how it works completely, but that was
  least of our problems the past week.


Honorable mentions:
* Garlic man
* TMUX and Vim, of course. You can always count on those two...
  (Although, this time we had some issues with tmux when we were
SSH-ing. SSH-ing with X11 forwarding isn't working really well with
tmux. So we had to disable tmux on shell start option)
* [beep](https://linux.die.net/man/1/beep)
* All the amazing man pages
* All the cookies that kept domspad's spirit up
* The bean bag that supported me day and night to work &amp; sleep peacefully(in New York
  time).

Not-so-proud-to-admit mentions:
* Whatsapp and Skype


We started where we left off on my last week in NYC. One liner
messages(text messages with repeated occurrence of the word
TICKLE, for example)
weren't even getting sent across the DNS tunnel iodine created via
Linus for our poor separated-by-NAT archies. `tcpdump` came to the rescue and as it turned out we were just
using the interface name wrong in our ICMP_chat script. We made
`tcmpdump` listen to the `dns0` interface that iodine created for us and the packets were actually getting through.


icmp_chat was still having trouble getting the message. Our diagnosis of the
problem at that time was that, since we were using some gibberish as
checksum, the router probably was rejecting the packets. So we found
this code online that created checksums for ICMP packets according to
the RFC standards and used it. And all our miseries came to an
end...(Although, at a later point the tcpdump again kept showing the
same `Wrong checksum` error and it continued working. It still remains a
mystery...).


Now the problem was how to filter out the chat messages from the rest of
the ICMP crap that got to the network. So we decided to monkey-patch
the icmphdr struct. We added a new attribute(aptly named `peanuts`),
which was set to 2 if it is an ICMPB_and_J packet and from that
point on, we were unstoppable.


Okay, so now sending one liners were easy... We had to send each other
text files and then images! We decided earlier to send across base64
encoded values of the contents of a file. Now came the biggest problem.
The ICMP protocol fragments the file into multiple packets because the
maximum size a packet can hold is 1100 bytes. Now how would icmp_chat
know how many packets to expect? We again monkey-patched the struct.
We added the attributes total_pkts and num_pkt to the struct. So the
icmp_shooter would update the total_pkts based on the file size
initially. On each packet shooting, the num_pkt would be incremented by
one. The icmp_chat keep receiving until the num_pkt is equal to
total_pkts. That was pretty much the last hiccup we had with our chat
scripts. We added a filename attribute to the
struct to save the file by the same name at the receiving end. We were even able to send small sized images across,
although it took a while. In fact this is one of the first images that
got through.


![what a surprise...](/assets/images/sprinkle_cookie.png)


As a bonus, we printed out an 'audible
bell' binary once the icmp_shooter completed shooting and the icmp_chat
completed receiving. It sounded like the most beautiful sound in the
world until it became very irritating.


So we did all that, and now we had to present it! This was the coolest
thing we ever did together and Dom was at RC presenting it in front of
all the RC-ers while I was sitting at the comforts of someone else's
home in Bangalore just making beep noises...


Linus got cold feet and started messing up our DNS tunnel. We had
moments of panic before the presentation. We had to keep restarting the
iodine a couple of times until it became somewhat stable right before
the presentation started. The commands we ran to send and receive the
image file was:

sender side:

`base64 garlic_man.png > garlic_man.txt`

`sudo icmp_shooter garlic_man.txt`

*BAMMMMM*
*BEEP*

receiver side:

`sudo icmp_chat`

*BEEP*

`base64 -d garlic_man.txt > garlic_man.png`

And that concludes our struggle to ping each other files... It was quite
a ride. Now we can proudly say this about our icmp_chat - *Se non ci
fossi dovrei inventarti...*


Grazzie per tutto il pesci... Ciao!


*Nandaja*

*June 11, 2017*
