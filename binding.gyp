{
  "targets": [
    {
      "target_name": "inet_xtoy",
      "sources": [ "main.cpp" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
