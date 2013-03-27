exports.health = (req, res) ->
  res.type("text")
  res.send("OK")
