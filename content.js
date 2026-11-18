// Ändra texterna här när du vill anpassa undervisningen.
window.WAVE_CONTENT = {
  systems: {
    string: {
      title: "Transversell våg i en sträng",
      ariaLabel: "Animerad illustration av en transversell våg i en sträng",
      boundary: "Fast – fast",
      formula: "L = n · λ / 2",
      legend: [
        ["line", "Strängens utslag"],
        ["dash", "Jämviktsläge"]
      ],
      concepts: [
        {
          title: "Noder",
          text: "En nod är en punkt som inte rör sig. En fast ände på strängen är alltid en nod."
        },
        {
          title: "Buk och amplitud",
          text: "Mellan två noder finns en buk, där strängen svänger som mest. Amplituden visar utslaget från jämviktsläget."
        },
        {
          title: "Tvärs mot vågen",
          text: "Strängens delar rör sig upp och ner, vinkelrätt mot vågens utbredningsriktning. Det kallas en transversell våg."
        }
      ],
      result: {
        resonant: "Våglängden passar!",
        notResonant: "Ingen resonans vid den här våglängden."
      }
    },
    pipe: {
      title: "Longitudinell våg i en pipa",
      ariaLabel: "Animerad illustration av en longitudinell ljudvåg i en pipa",
      legend: [
        ["dots", "Luftpartiklar"],
        ["compression", "Förtätning"],
        ["rarefaction", "Förtunning"]
      ],
      concepts: [
        {
          title: "Förtätning och förtunning",
          text: "Prickarna visar luftpartiklar. Där prickarna ligger tätt är luften förtätad; där de ligger glest är den förtunnad."
        },
        {
          title: "Öppen och sluten ände",
          text: "Vid en öppen ände kan luften röra sig fritt. Vid en sluten ände kan luftpartiklarna inte röra sig längs pipan."
        },
        {
          title: "Längs vågen",
          text: "Luftpartiklarna svänger fram och tillbaka i samma riktning som ljudvågen breder ut sig. Det kallas en longitudinell våg."
        }
      ],
      result: {
        resonant: "Våglängden passar!",
        notResonant: "Ingen resonans vid den här våglängden."
      }
    }
  },
  approximateResonanceTolerance: 0.006,
  lengthMeters: 1
};
