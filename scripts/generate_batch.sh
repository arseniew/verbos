#!/bin/bash
verbs=("estar" "ir" "hacer" "poder" "decir" "ver" "dar" "saber" "querer" "llegar" "pasar" "deber" "poner" "parecer" "quedar" "creer" "hablar" "llevar" "dejar")
for verb in "${verbs[@]}"; do
  echo "Generating $verb..."
  timeout 30 node scripts/generate.js --verb="$verb" --tenses="Present,Preterite,Imperfect,Conditional,Future"
  if [ $? -eq 124 ]; then
    echo "Timeout! Retrying $verb..."
    timeout 30 node scripts/generate.js --verb="$verb" --tenses="Present,Preterite,Imperfect,Conditional,Future"
  fi
  echo "Resting to respect API limits..."
  sleep 4
done
echo "All done!"
