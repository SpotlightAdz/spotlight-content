#!/bin/bash
# renders each variant with 2 parallel segments, muxes with the mix
cd "$(dirname "$0")"; OUT=../2026-11-w2; mkdir -p $OUT parts5
declare -A NAME=([R]=01-restaurant-mistakes-reel [B]=03-aboujoud-keynote-reel [E]=04-anatomy-reel [C]=05-pov-cousin-reel [Z]=07-caftan-system-reel)
for v in "$@"; do
  T=$(python3 -c "import render5;print(render5.VARIANTS['$v']['total'])")
  M=$(python3 -c "print(round(int($T*15)/30,3))")
  python3 render5.py $v 0 $M parts5/$v-a.mp4 & python3 render5.py $v $M 999 parts5/$v-b.mp4 & wait
  printf "file '$v-a.mp4'\nfile '$v-b.mp4'\n" > parts5/$v.txt
  ffmpeg -y -loglevel error -f concat -safe 0 -i parts5/$v.txt -c copy parts5/$v.mp4
  python3 audio5.py $v; python3 audio5.py $v bed; python3 audio5.py $v vo
  ffmpeg -y -loglevel error -i parts5/$v.mp4 -i mix5$v.wav -map 0:v -map 1:a -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $OUT/${NAME[$v]}.mp4
  echo DONE $v
done
