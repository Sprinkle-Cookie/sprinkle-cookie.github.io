# To set it up locally


* Install `rubygems` and `bundler`

`sudo pacman -S rubygems`

`gem install bundler`


Add the gem bin to your PATH.

`export PATH=$PATH:~/.gem/ruby/<version>/bin/`

Adding it to .bashrc will save you a lot of trouble.


* Install packages needed for sprinkle cookie to run locally


`bundle update`

`bundle install`


* To run the server


Build sprinkle cookie first

`bundle exec jekyll build`


and then you run it...

`bundle exec jekyll serve`


It should be running right now at localhost:4000
