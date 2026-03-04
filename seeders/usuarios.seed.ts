import { resetIdentity } from ".";
import { db } from "../src/db";
import { genero, userRoles, usuariosTable } from "../src/schemas/usuarios.schema";
import { InferInsertModel } from "drizzle-orm";

type UsuarioInsert = InferInsertModel<typeof usuariosTable>;

const usuariosSeed: UsuarioInsert[] = [
    {
        nombre: "Gabriell",
        apellido: "Isgar",
        email: "gisgar0@boston.com",
        dni: "99956352",
        genero: genero.otro,
        passwordHash:
            "$2a$04$U4SUJcM/O.j6L0KocL9pCeX3qacIwxNPFGzSWixNWjZVzmzXC7Cp2",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Kassie",
        apellido: "Ivoshin",
        email: "kivoshin1@1und1.de",
        dni: "78145918",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$4uacNgi.vhCQ/bQie3CxNOZnvb9mpnxN3pLywvCbnm6ixT5nFeMe.",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Aldridge",
        apellido: "Cuzen",
        email: "acuzen2@xrea.com",
        dni: "98026621",
        genero: genero.femenino,
        passwordHash:
            "$2a$04$mgr.Hbe2n3kSm6PMltbpsOOOUvlpZ/56mc.9gnz7.I8emuvI/WqCS",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Saloma",
        apellido: "Beecker",
        email: "sbeecker3@springer.com",
        dni: "42015697",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$JNRqo2SXpNgV0QxiEv7l.eezgBvnVyy1KFVJhJKOX3XFHLPvJ.m26",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Alexia",
        apellido: "Habgood",
        email: "ahabgood4@buzzfeed.com",
        dni: "50967121",
        genero: genero.femenino,
        passwordHash:
            "$2a$04$m/D5nP0CUQa5YUdlHNJ1QucPIlalvo9dOsqLxCrMLjjfQB2ECqkay",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Robenia",
        apellido: "Horsey",
        email: "rhorsey5@noaa.gov",
        dni: "99819808",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$S9ZbgY7FHlZBP7E0avFiV.jCD7dGGQZXdrJ6F1D0vgXDbflS.jJwu",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Gerry",
        apellido: "Lukehurst",
        email: "glukehurst6@dropbox.com",
        dni: "6231680",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$1GERf/YdMXt7nQS1FIyDJu6JVsXFYJhA4f7mFasmQKFharJA25R9O",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Arluene",
        apellido: "Rochelle",
        email: "arochelle7@indiegogo.com",
        dni: "26640203",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$aBKnsowG6ozm.kZZ.phE.OfUYXgZPowEsgyy8FfFPAVu0hrj7etyi",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Jonie",
        apellido: "Chesworth",
        email: "jchesworth8@dion.ne.jp",
        dni: "93096483",
        genero: genero.femenino,
        passwordHash:
            "$2a$04$24TWW1wGw9ZMNY7JwkzAj.WjjvAtdIJAV06hSHz2zsI6oLZ9BUhea",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Camile",
        apellido: "Placido",
        email: "cplacido9@flickr.com",
        dni: "11746923",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$8xPSbt43b1oVEOsiz81GaOlmoTL/byof6soCLOiosZSArw/unkyzO",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Prince",
        apellido: "Tampling",
        email: "ptamplinga@vk.com",
        dni: "86878782",
        genero: genero.otro,
        passwordHash:
            "$2a$04$KxcNujH2lsnGsumI3LuG/.NBIHUXFXPwFJYptcZxquObItcgp/U6G",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Leonardo",
        apellido: "Scorton",
        email: "lscortonb@aol.com",
        dni: "37586914",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$nKw0ff1B0iptcLUA1zRffOaFGLvf2k8AQO4CrFynkKUu/rKbVrZz6",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Oates",
        apellido: "MacElane",
        email: "omacelanec@army.mil",
        dni: "89419444",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$37eMzmmWec4zA/avjae5dubu2J10SxmxX8mbmPVDMliY1iZ0djySe",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Jacklyn",
        apellido: "Mountford",
        email: "jmountfordd@creativecommons.org",
        dni: "12538806",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$qrayV/evPVdGjsjPr.t0b.Ra8bqD.Un5zsn/HjorNjd2AmFtN12GW",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Paten",
        apellido: "Probert",
        email: "pproberte@japanpost.jp",
        dni: "76608227",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$bOc3iNioeInn5iiNfu7Kh.cRFlxkbV4PATvBuWg.TEn4xbm8KdZE.",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Claire",
        apellido: "Schimoni",
        email: "cschimonif@wired.com",
        dni: "40696277",
        genero: genero.otro,
        passwordHash:
            "$2a$04$LtqDP5F96rici3k6gfB7..jB7X4Wud5iuKIRJCPZXs0ZFSsMYAHaO",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Albert",
        apellido: "Beall",
        email: "abeallg@springer.com",
        dni: "70116077",
        genero: genero.otro,
        passwordHash:
            "$2a$04$gX.XbCwJNIP9cCIXvXdJDusiHzBAX4SP3/E9JMgtVjCKa6qqn38TK",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Ronny",
        apellido: "Soff",
        email: "rsoffh@yale.edu",
        dni: "40074091",
        genero: genero.femenino,
        passwordHash:
            "$2a$04$bMQo0NcKm94MiiGaDzO0S.2BYw.J6RMv7I0ej/pptwQIw2vdqXnme",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Sheryl",
        apellido: "Priddle",
        email: "spriddlei@bbb.org",
        dni: "18139875",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$5Pqk.UGIOzqfLj0DhxQGiuBGCs3QWF4eKLbfsuBs6x951kCRuGT1m",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Valentine",
        apellido: "Bettison",
        email: "vbettisonj@i2i.jp",
        dni: "24830773",
        genero: genero.otro,
        passwordHash:
            "$2a$04$hGthEP2vNlCW3iMeGlznA.nYK0DQ2vlDPW4zz087ZFPgsWHfggtCy",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Nikoletta",
        apellido: "von Hagt",
        email: "nvonhagtk@mozilla.com",
        dni: "64688847",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$JrAFXP8cyLyYgsHq59zAYuSRlHlgLdWpKFAdW3l0oRNY/glG8sqma",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Henryetta",
        apellido: "Cavan",
        email: "hcavanl@studiopress.com",
        dni: "3943306",
        genero: genero.otro,
        passwordHash:
            "$2a$04$x0zJ2SWwu.sDyKjNlF6C/O0KtqkZqr3iwkFNkglKpZgX.DOhotMgG",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Dwight",
        apellido: "Skough",
        email: "dskoughm@a8.net",
        dni: "81124719",
        genero: genero.otro,
        passwordHash:
            "$2a$04$6ZtSUGo9I3cOiP5wRHgDc.QqdI0zitL6OPoKYz.Gzk0Ic05xRRwl6",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Allie",
        apellido: "Manlow",
        email: "amanlown@ning.com",
        dni: "53878605",
        genero: genero.femenino,
        passwordHash:
            "$2a$04$5Y1Ji7UWxAZn3f4IJHFTCuExn0ye/EtvMr4vTQP3mtayvZ1Xajfnq",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Abel",
        apellido: "Samuels",
        email: "asamuelso@soup.io",
        dni: "44401370",
        genero: genero.femenino,
        passwordHash:
            "$2a$04$ZKv7TqesCONfKBSs1rDskOBNnOwER5gfJYNKUakpIykV9xyXFYmyO",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Stacey",
        apellido: "Howood",
        email: "showoodp@360.cn",
        dni: "68026582",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$9NA3zHNcUOwWedJxIymwNubXie4773G8kCxKP07laAF.8ZKlbtPRy",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Lyndel",
        apellido: "Pettinger",
        email: "lpettingerq@thetimes.co.uk",
        dni: "86736375",
        genero: genero.otro,
        passwordHash:
            "$2a$04$4peY.P3oGtSXNwd/12bglOPi.ySazPeR7xags8VXDBnVH8YPHgnQy",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Lynda",
        apellido: "Gaunter",
        email: "lgaunterr@spotify.com",
        dni: "51269147",
        genero: genero.otro,
        passwordHash:
            "$2a$04$BnsdFSyW8jVh.axAx8hEv.pV/8Ctb48UMO2HTb5kViz5nv/6dX8Kq",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Daveta",
        apellido: "Rumney",
        email: "drumneys@xrea.com",
        dni: "32375729",
        genero: genero.femenino,
        passwordHash:
            "$2a$04$AJBAezWq0248sMql1a6Jp.ufJj9LIUSFzkYppXvHxckYV6yEM3.pm",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Kirsten",
        apellido: "McAster",
        email: "kmcastert@angelfire.com",
        dni: "9738997",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$Gb9KycICYj.ZRF1HRLhfNuEENh.f7NKZt4vdDCsnQFl8p.0V.fa3G",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Leesa",
        apellido: "Dubock",
        email: "ldubocku@cornell.edu",
        dni: "82123769",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$U9.L6te19v2JNtUThXrnleLtKBLb/rz2B8BQX5oheM64xRk2FGuLu",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Vergil",
        apellido: "De La Coste",
        email: "vdelacostev@opensource.org",
        dni: "83151522",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$zfhFasJU0Bmqi4lr.aRwFuP/FrCKVIK1CcLGNyo8Wx1.Dn.5dVe9u",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Millie",
        apellido: "Madigan",
        email: "mmadiganw@economist.com",
        dni: "92394929",
        genero: genero.otro,
        passwordHash:
            "$2a$04$lhHNUoMFOVVWJbRevtaQ2.ECJjoS6kumbaOUFiCZhCVVoMRGcV.aO",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Harriott",
        apellido: "Babonau",
        email: "hbabonaux@hud.gov",
        dni: "51939629",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$ukLyO7Wx9ffXB0aq4.l4uO/JubijydStnNm1BIwbk6LRgrhTItEse",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Veda",
        apellido: "Kellett",
        email: "vkelletty@arizona.edu",
        dni: "63388012",
        genero: genero.otro,
        passwordHash:
            "$2a$04$JRTDjudufouCy.FX18VaouyoHby8.hNYlH0TZV7J09sV/Qg/0rh3K",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Prisca",
        apellido: "Gulliman",
        email: "pgullimanz@tamu.edu",
        dni: "64931714",
        genero: genero.otro,
        passwordHash:
            "$2a$04$aCt9IQu6Ys3c..NZDIfZguh20KHgQmELUJ/lJLa5unSRh72ww2/se",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Marcela",
        apellido: "Dell Casa",
        email: "mdellcasa10@jalbum.net",
        dni: "71663993",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$/38DR1yptS0oxBJTD.j3seqS8pd8atnBY/9wl1eKe/dwJ//NpUFm6",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Amalia",
        apellido: "Spriggen",
        email: "aspriggen11@macromedia.com",
        dni: "46524783",
        genero: genero.femenino,
        passwordHash:
            "$2a$04$HJZnxq8l5paAFWVL.0f3jOxNbfs0wSYQHAUL4/5oW.vPZUHBpPlJ.",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Audry",
        apellido: "Edmeades",
        email: "aedmeades12@goo.ne.jp",
        dni: "6779613",
        genero: genero.otro,
        passwordHash:
            "$2a$04$kMAWlCb8O.gQDOJTqIZsiet1X.Nerw3MQ8QpMsw8s0AgGZDZehVPe",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Ivett",
        apellido: "Mahy",
        email: "imahy13@ning.com",
        dni: "66788531",
        genero: genero.otro,
        passwordHash:
            "$2a$04$DAniZPxTdyOVKQwTHGIyP.dIs7hNuYwNCNKIJN8ttgv87jkpYy2Sa",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Marie",
        apellido: "Farncomb",
        email: "mfarncomb14@yale.edu",
        dni: "15209632",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$NkrEi9YR/X4oa1nUU8wdjOfWLtCjbgJvMUNzRIW20Els5JMKrqevi",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Aindrea",
        apellido: "Sommerled",
        email: "asommerled15@cdbaby.com",
        dni: "71891044",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$F5kzajQi/MMwkAQuyFWyEO5SG8h1qEGM6KCxT/Vi3eDCmHd8VYD6W",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Rubie",
        apellido: "Lawtey",
        email: "rlawtey16@usda.gov",
        dni: "80581864",
        genero: genero.otro,
        passwordHash:
            "$2a$04$kraqqChPTewwM4lA82wBAOQUtY.jTOCGdPdGHAxU97aONErCwaF5y",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Jock",
        apellido: "Commins",
        email: "jcommins17@comcast.net",
        dni: "63187055",
        genero: genero.otro,
        passwordHash:
            "$2a$04$nIh1P/coqcttPkIqIX7fXOV7G6jTP7WpXI3v6BvGrIRsih7p7OXwm",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Katerine",
        apellido: "Belhome",
        email: "kbelhome18@amazonaws.com",
        dni: "27228521",
        genero: genero.femenino,
        passwordHash:
            "$2a$04$3wQpOTsFwJJyYVys08wD0urPgXCWLYA3DkLSCReUvq9EyGFdCW8Y2",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Georgy",
        apellido: "Mathouse",
        email: "gmathouse19@domainmarket.com",
        dni: "13622822",
        genero: genero.otro,
        passwordHash:
            "$2a$04$Kjj4o8kDcVZDsT4GiiBicemVrmk9bduK.lu377EmB1TorUYprApAa",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Fons",
        apellido: "Billie",
        email: "fbillie1a@cyberchimps.com",
        dni: "64729848",
        genero: genero.masculino,
        passwordHash:
            "$2a$04$IpRG5I6XqdF3wTzfjjaAR.28757kw9UB6Pe0JxJqlSP1U6ydNf/Cm",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Anatola",
        apellido: "Barrand",
        email: "abarrand1b@smh.com.au",
        dni: "59726000",
        genero: genero.femenino,
        passwordHash:
            "$2a$04$cGSdbJ9/hNWaiwKuqe8KB.F4G5wbyhO.SueIJw2X3Zd8H9AtpzhLi",
        activo: 1,
        role: userRoles.finalUser
    },
    {
        nombre: "Karie",
        apellido: "Gingedale",
        email: "kgingedale1c@discovery.com",
        dni: "56918693",
        genero: genero.femenino,
        passwordHash:
            "$2a$04$xmpNKf4sENQHYieWeMM8iu3QA.c74Ai1C9bPFJbqKqrstyR3t9yUW",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Brendis",
        apellido: "Whistlecraft",
        email: "bwhistlecraft1d@nydailynews.com",
        dni: "71040638",
        genero: genero.otro,
        passwordHash:
            "$2a$04$KTBmOZpI6Ha2e/f845TM7ew3/HJiU1A4C1hgIooDecT5gIpi6t.Tm",
        activo: 0,
        role: userRoles.finalUser
    },
    {
        nombre: "Admin",
        apellido: "Admin",
        email: "admin@gmail.com",
        dni: "44231764",
        genero: genero.masculino,
        passwordHash:
            "$2b$10$WKAxgdLsbTNl609cFGz6w.n9QP7FT3Z9FPSwubE4Iqbr3xkDJmK4K", // user123
        activo: 1,
        role: userRoles.admin
    },
    {
        nombre: "User",
        apellido: "User",
        email: "user@gmail.com",
        dni: "44231763",
        genero: genero.masculino,
        passwordHash:
            "$2b$10$WKAxgdLsbTNl609cFGz6w.n9QP7FT3Z9FPSwubE4Iqbr3xkDJmK4K", // user123
        activo: 1,
        role: userRoles.finalUser
    }
];

export async function seedUsuarios() {
    await resetIdentity(usuariosTable);
    await db.insert(usuariosTable).values(usuariosSeed);
}
