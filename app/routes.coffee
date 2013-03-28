module.exports = (match) ->
  match '',                   'home#index'
  match 'repos/:owner/:name', 'repos#show'
  match 'users/:login',       'users#show'
