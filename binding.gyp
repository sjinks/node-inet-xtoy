{
  "targets": [
    {
      "target_name": "inet_xtoy",
      "sources": [
        "main.cpp"
      ],
      "cflags!": [
        "-fno-exceptions"
      ],
      "cflags_cc!": [
        "-fno-exceptions"
      ],
      "cflags+": [
        "-fvisibility=hidden"
      ],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include_dir\")"
      ],
      "defines": [
        "NODE_ADDON_API_DISABLE_DEPRECATED",
        "NAPI_VERSION=<(napi_build_version)"
      ]
    }
  ]
}
