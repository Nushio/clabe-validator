// CLABE Validator v1.0.3
// github.com/center-key/clabe-validator
// MIT License

var clabe = {

   release: 'v1.0.3',

   calcChecksum: function(clabeNum) {
      // Returns the checksum calculated from the first 17 characters of CLABE number.
      // Example:
      //    var checksum = clabe.calcChecksum('00201007777777777');  //value: 1
      var sum = 0;
      function add(digit, index) { sum += (parseInt(digit) * [3, 7, 1][index % 3]) % 10; }
      clabeNum.split('').slice(0, 17).forEach(add);
      return (10 - (sum % 10)) % 10;
      },

   validate: function(clabeNum) {
      // Returns information in a map (object literal) about the CLABE number.
      // Example:
      //    var city = clabe.validate('002010077777777771').city;  //value: "Banco Nacional de México"
      if (typeof clabeNum !== 'string')
         throw 'clabe.validator.check(clabeNum) -- Parameter must be a string';
      var bankCode = clabeNum.substr(0, 3);
      var cityCode = clabeNum.substr(3, 3);
      var checksum = parseInt(clabeNum.substr(17, 1));
      function makeCitiesMap() {
         clabe.citiesMap = {};
         function prefix(code) { return clabe.citiesMap[code] ? clabe.citiesMap[code] + ', ' : ''; }
         function addCity(city) { clabe.citiesMap[city[0]] = prefix(city[0]) + city[1]; }  //0: code, 1: name
         clabe.cities.forEach(addCity);
         }
      if (!clabe.citiesMap)
         makeCitiesMap();
      var bank = clabe.banksMap[parseInt(bankCode)];
      var city = clabe.citiesMap[parseInt(cityCode)];
      function calcChecksum() { return clabe.calcChecksum(clabeNum); }
      function getErrorMessage() {
         return (
            clabeNum.length !== 18 ?      'Must be exactly 18 digits long' :
            !/[0-9]{18}/.test(clabeNum) ? 'Must be only numeric digits (no letters)' :
            calcChecksum() !== checksum ? 'Invalid checksum, last digit should be: ' + calcChecksum() :
            !bank ?                       'Invalid bank code' :
            !city ?                       'Invalid city code' :
            false
            );
         }
      var error = getErrorMessage();
      return {
         error:   !!error,
         message: error || 'Valid: ' + bank + ' (' + city + ')',
         bank:    bank,
         city:    city
         };
      },

   calculate: function(bankCode, cityCode, accountNumber) {
      // Returns an 18-character CLABE number.
      // Example:
      //    var clabeNum = clabe.calculate(2, 10, 7777777777);  //value: "002010077777777771"
      function pad(num, len) { return num.length < len ? pad('0' + num, len) : num; }
      function fit(num, len) { return pad('' + num, len).slice(-len); }
      var clabeNum = fit(bankCode, 3) + fit(cityCode, 3) + fit(accountNumber, 11);
      return clabeNum + clabe.calcChecksum(clabeNum);
      },

   banksMap: {  //source: https://es.wikipedia.org/wiki/CLABE#C.C3.B3digo_de_banco (Jan 9, 2017)
        2: 'Banco Nacional de México',
        6: 'Banco Nacional de Comercio Exterior',
        9: 'Banco Nacional de Obras y Servicios Públicos',
       12: 'BBVA Bancomer',
       14: 'Banco Santander',
       19: 'Banco Nacional del Ejército',
       21: 'HSBC México',
       22: 'GE Money Bank',
       30: 'Banco del Bajío',
       32: 'IXE Banco',
       36: 'Banco Inbursa',
       37: 'Banco Interacciones',
       42: 'Banca Mifel',
       44: 'Scotiabank Inverlat',
       58: 'Banco Regional de Monterrey',
       59: 'Banco Invex',
       60: 'Bansi',
       62: 'Banca Afirme',
       72: 'Banco Mercantil del Norte',
      102: 'ABN AMRO Bank México',
      103: 'American Express Bank (México)',
      106: 'Bank of America México',
      108: 'Bank of Tokyo-Mitsubishi UFJ (México)',
      110: 'Banco J.P. Morgan',
      112: 'Banco Monex',
      113: 'Banco Ve por Mas',
      116: 'ING Bank (México)',
      124: 'Deutsche Bank México',
      126: 'Banco Credit Suisse (México)',
      127: 'Banco Azteca',
      128: 'Banco Autofin México',
      129: 'Barclays Bank México',
      130: 'Banco Compartamos',
      131: 'Banco Ahorro Famsa',
      132: 'Banco Multiva',
      133: 'Prudencial Bank',
      134: 'Banco Wal Mart de México Adelante',
      135: 'Nacional Financiera',
      136: 'Banco Regional',
      137: 'BanCoppel',
      138: 'Banco Amigo',
      139: 'UBS Banco',
      140: 'Banco Fácil',
      141: 'Volkswagen Bank',
      143: 'Consultoría Internacional Banco',
      145: 'Banco BASE de I.B.M.',
      147: 'Bankaool, Institución de Banca Múltiple',
      150: 'Banco Inmobiliario Mexicano',
      156: 'Banco Sabadell, S.A. I.B.M.',
      166: 'Banco del Ahorro Nacional y Servicios Financieros',
      168: 'Sociedad Hipotecaria Federal',
      600: 'Monex Casa de Bolsa',
      601: 'GBM Grupo Bursátil Mexicano',
      602: 'Masari Casa de Cambio',
      604: 'Inversora Bursátil',
      605: 'Valué, Casa de Bolsa',
      606: 'Base Internacional Casa de Bolsa',
      607: 'Casa de Cambio Tiber',
      608: 'Vector Casa de Bolsa',
      610: 'B y B Casa de Cambio',
      611: 'Intercam Casa de Cambio',
      613: 'Multivalores Casa de Bolsa Multiva Gpo. Fin.',
      614: 'Acciones y Valores Banamex',
      615: 'Merrill Lynch México',
      616: 'Casa de Bolsa Finamex',
      617: 'Valores Mexicanos',
      618: 'Única Casa de Cambio',
      619: 'MAPFRE Tepeyac',
      620: 'Profuturo G.N.P.',
      621: 'Actinver Casa de Bolsa',
      622: 'Actinver',
      623: 'Skandia Vida',
      624: 'Consultoría Internacional Casa de Cambio',
      626: 'Deutsche Securities, S.A. de C.V.',
      627: 'Zurich Compañía de Seguros',
      628: 'Zurich Vida, Compañía de Seguros',
      629: 'Hipotecaria su Casita',
      630: 'Intercam Casa de Bolsa',
      631: 'Vanguardia Casa de Bolsa',
      632: 'Bulltick Casa de Bolsa',
      633: 'Sterling Casa de Cambio',
      634: 'Fincomún, Servicios Financieros Comunitarios',
      636: 'HDI Seguros, S.A. de C.V.',
      637: 'OrderExpress Casa de Cambio AAC',
      638: 'Akala, Sociedad Financiera Popular',
      640: 'J.P. Morgan Casa de Bolsa',
      642: 'Operadora de Recursos Reforma, S.A. de C.V.',
      646: 'Sistema de Transferencias y Pagos STP',
      647: 'Telecomunicaciones de México',
      648: 'Evercore Casa de Bolsa, S.A. de C.V.',
      649: 'Skandia Operadora',
      651: 'Seguros Monterrey New York Life, S.A de C.V.',
      652: 'Solución Asea, S.A. de C.V., Sociedad Financiera Popular',
      653: 'Kuspit Casa de Bolsa, S.A. de C.V.',
      655: 'J.P. SOFIEXPRESS, S.A. de C.V., S.F.P.',
      656: 'UNAGRA, S.A. de C.V., S.F.P.',
      659: 'Opciones Empresariales Del Noreste, S.A. DE C.V.',
      670: 'Libertad Servicios Financieros, S.A. De C.V.',
      901: 'CLS Bank International',
      902: 'SD. INDEVAL',
      999: 'N/A'
      },

   cities: [  //source: https://es.wikipedia.org/wiki/CLABE#C.C3.B3digo_de_plaza (Jan 9, 2017)
      [ 10, 'Aguascalientes'],
      [ 12, 'Calvillo'],
      [ 14, 'Jesús María'],
      [ 20, 'Mexicali'],
      [ 22, 'Ensenada'],
      [ 27, 'Tecate'],
      [ 27, 'Tijuana'],
      [ 28, 'La Mesa'],
      [ 28, 'Rosarito'],
      [ 28, 'Tijuana [alternate]'],  //see first occurrence at 27
      [ 40, 'La Paz'],
      [ 41, 'Cabo San Lucas'],
      [ 42, 'Ciudad Constitución'],
      [ 43, 'Guerrero Negro'],
      [ 45, 'San José del Cabo'],
      [ 46, 'Santa Rosalía'],
      [ 50, 'Campeche'],
      [ 51, 'Calkiní'],
      [ 52, 'Ciudad del Carmen'],
      [ 53, 'Champotón'],
      [ 60, 'Gómez Palacio'],
      [ 60, 'Torreón'],
      [ 62, 'Ciudad Acuña'],
      [ 68, 'Monclova'],
      [ 71, 'Nava'],
      [ 72, 'Nueva Rosita'],
      [ 74, 'Parras de la Fuente'],
      [ 75, 'Piedras Negras'],
      [ 76, 'Ramos Arizpe'],
      [ 77, 'Sabinas'],
      [ 78, 'Saltillo'],
      [ 80, 'San Pedro de las Colonias'],
      [ 90, 'Colima'],
      [ 95, 'Manzanillo'],
      [ 97, 'Tecomán'],
      [100, 'Terán'],
      [100, 'Tuxtla Gutiérrez'],
      [103, 'Arriaga'],
      [107, 'Cintalapa'],
      [109, 'Comitán'],
      [109, 'Villa Las Rosas'],
      [111, 'Chiapa de Corso'],
      [113, 'F. Comalapa'],
      [114, 'Huixtla'],
      [123, 'Ocosingo'],
      [124, 'Ocozocuautla'],
      [125, 'Palenque'],
      [126, 'Pichucalco'],
      [127, 'Pijijiapan'],
      [128, 'Reforma'],
      [130, 'San Cristóbal de las Casas'],
      [131, 'Simojovel'],
      [133, 'Tapachula'],
      [135, 'Tonala'],
      [137, 'Venustiano Carranza'],
      [138, 'Villa Flores'],
      [140, 'Yajalón'],
      [150, 'Chihuahua'],
      [150, 'Ciudad Delicias'],
      [152, 'Ciudad Anáhuac'],
      [155, 'Ciudad Camargo'],
      [158, 'Ciudad Cuauhtémoc'],
      [161, 'Ciudad Guerrero'],
      [162, 'Parral'],
      [163, 'Ciudad Jiménez'],
      [164, 'Ciudad Juárez'],
      [165, 'Ciudad Madera'],
      [167, 'El Molino de Namiquipa'],
      [168, 'Nuevo Casas Grandes'],
      [180, 'Atizapan'],
      [180, 'Chalco'],
      [180, 'Ciudad de México'],
      [180, 'Coacalco'],
      [180, 'Cuautitlán Izcalli'],
      [180, 'Cuautitlán'],
      [180, 'Ecatepec'],
      [180, 'Huehuetoca'],
      [180, 'Huixquilucan'],
      [180, 'Ixtapaluca'],
      [180, 'Los Reyes La Paz'],
      [180, 'Naucalpan'],
      [180, 'Nezahualcóyotl'],
      [180, 'Tecamac'],
      [180, 'Teotihuacán'],
      [180, 'Texcoco'],
      [180, 'Tlalnepantla'],
      [190, 'Durango'],
      [201, 'Tepehuanes'],
      [202, 'Vicente Guerrero'],
      [210, 'Guanajuato'],
      [211, 'Abasolo'],
      [212, 'Acámbaro'],
      [213, 'Apaseo el Alto'],
      [214, 'Apaseo el Grande'],
      [215, 'Celaya'],
      [216, 'Comonfort'],
      [217, 'Coroneo'],
      [218, 'Cortazar'],
      [219, 'Cuerámaro'],
      [220, 'Dolores Hidalgo'],
      [222, 'Irapuato'],
      [223, 'Jaral del Progreso'],
      [224, 'Jerécuaro'],
      [225, 'León'],
      [226, 'Cd. Manuel Doblado'],
      [227, 'Moroleón'],
      [229, 'Pénjamo'],
      [232, 'Romita'],
      [233, 'Salamanca'],
      [234, 'Salvatierra'],
      [236, 'San Felipe'],
      [237, 'Purísima de Bustos'],
      [237, 'San Francisco del Rincoón'],
      [238, 'San José Iturbide'],
      [239, 'San Luis de la Paz'],
      [240, 'San Miguel Allende'],
      [244, 'Silao'],
      [247, 'Uriangato'],
      [248, 'Valle de Santiago'],
      [249, 'Yuriria'],
      [260, 'Chilpancingo'],
      [261, 'Acapulco'],
      [263, 'Arcelia'],
      [264, 'Atoyac de Álvarez'],
      [266, 'Ciudad Altamirano'],
      [267, 'Coyuca de Benítez'],
      [270, 'Chilapa'],
      [271, 'Huitzuco'],
      [272, 'Iguala'],
      [272, 'La Sabana'],
      [274, 'Cuajinicuilapa'],
      [274, 'Ometepec'],
      [275, 'San Marcos'],
      [276, 'Taxco'],
      [278, 'Teloloapan'],
      [281, 'Tlapa'],
      [282, 'Ixtapa Zihuatanejo'],
      [282, 'Zihuatanejo'],
      [290, 'Pachuca'],
      [291, 'Actopan'],
      [292, 'Apam'],
      [293, 'Atotonilco el Grande'],
      [294, 'Ciudad Sahagún'],
      [294, 'Teocaltiche'],
      [295, 'Cuautepec'],
      [296, 'Huejutla'],
      [297, 'Huichapan'],
      [298, 'Ixmiquilpan'],
      [303, 'Progreso de Obregón'],
      [305, 'Tepeapulco'],
      [308, 'Tizayuca'],
      [311, 'Tula de Allende'],
      [312, 'Tulancingo'],
      [313, 'Zacualtipán'],
      [314, 'Zimapán'],
      [320, 'El Salto'],
      [320, 'Guadalajara'],
      [320, 'San Pedro Tlaquepaque'],
      [320, 'Tlajomulco'],
      [320, 'Tonala [alternate]'],  //see first occurrence at 135
      [320, 'Zapopan'],
      [326, 'Ameca'],
      [327, 'Arandas'],
      [330, 'Atotonilco el Alto'],
      [331, 'Atequiza'],
      [333, 'Autlán'],
      [334, 'Azteca'],
      [340, 'Casimiro Castillo'],
      [341, 'Cihuatlán'],
      [342, 'Ciudad Guzmán'],
      [346, 'Chapala'],
      [348, 'El Grullo'],
      [355, 'Ixtlahuacán del Río'],
      [356, 'Jalostotitlán'],
      [357, 'Jamay'],
      [361, 'La Barca'],
      [362, 'Lagos de Moreno'],
      [370, 'Ocotlán'],
      [373, 'Pihuamo'],
      [375, 'Las Juntas'],
      [375, 'Nuevo Vallarta'],
      [375, 'Pitillal'],
      [375, 'Puerto Vallarta'],
      [381, 'San Juan de los Lagos'],
      [384, 'San Miguel el Alto'],
      [385, 'San Patricio Melaque'],
      [386, 'Sayula'],
      [387, 'Tala'],
      [389, 'Tamazula de Gordiano'],
      [391, 'Tecalitlán'],
      [396, 'Tepatitlán'],
      [397, 'Tequila'],
      [403, 'Tototlán'],
      [404, 'Túxpam'],
      [411, 'Villa Hidalgo'],
      [413, 'Zacoalco de Torres'],
      [414, 'Zapotiltic'],
      [416, 'Zapotlanejo'],
      [420, 'Toluca'],
      [421, 'Acambay'],
      [422, 'Almoloya de Juárez'],
      [424, 'Amecameca'],
      [425, 'Apaxco'],
      [426, 'Atlacomulco'],
      [428, 'Coatepec de Harinas'],
      [430, 'Chicoloapan'],
      [431, 'Chiconcuac'],
      [432, 'El Oro'],
      [433, 'Ixtapan de la Sal'],
      [434, 'Ixtlahuaca'],
      [435, 'Jilotepec'],
      [438, 'Lerma'],
      [441, 'Metepec'],
      [443, 'Otumba'],
      [445, 'San Mateo Atenco'],
      [446, 'Tejupilco'],
      [448, 'Temascaltepec'],
      [449, 'Temoaya'],
      [450, 'Tenancingo'],
      [451, 'Tenago del Valle'],
      [453, 'Santiago Tiangistenco'],
      [455, 'Tultepec'],
      [456, 'Tultitlán'],
      [457, 'Valle de Bravo'],
      [460, 'Villa Nicolás Romero'],
      [463, 'Zumpango'],
      [470, 'Morelia'],
      [472, 'Aguililla'],
      [476, 'Apatzingán'],
      [480, 'Ciudad Hidalgo'],
      [483, 'Cotija'],
      [484, 'Cuitzeo'],
      [492, 'Huetamo'],
      [493, 'Jacona'],
      [494, 'Jiquilpan'],
      [496, 'La Piedad'],
      [497, 'Lázaro Cárdenas'],
      [498, 'Los Reyes'],
      [499, 'Maravatío'],
      [501, 'Nueva Italia'],
      [506, 'Pátzcuaro'],
      [508, 'Purépero'],
      [509, 'Puruandiro'],
      [512, 'Sahuayo'],
      [515, 'Tacámbaro'],
      [517, 'Tangancícuaro'],
      [519, 'Tepalcatepec'],
      [523, 'Tlazazalca'],
      [528, 'Uruapan'],
      [533, 'Yurécuaro'],
      [534, 'Zacapu'],
      [535, 'Zamora'],
      [536, 'Zinapécuaro'],
      [537, 'Zitácuaro'],
      [540, 'Cuernavaca'],
      [542, 'Cuautla'],
      [542, 'Oaxtepec, Morelos'],
      [543, 'Jiutepec'],
      [544, 'Jojutla'],
      [545, 'Puente de Ixtla'],
      [546, 'Temixco'],
      [548, 'Tetecala'],
      [549, 'Yautepec'],
      [552, 'Zacatepec'],
      [560, 'Tepic'],
      [561, 'Acaponeta'],
      [562, 'Ahuacatlán'],
      [564, 'Compostela'],
      [566, 'Ixtlán del Río'],
      [571, 'San Blas'],
      [573, 'Santiago Ixcuintla'],
      [575, 'Túxpam [alternate]'],  //see first occurrence at 404
      [580, 'Apodaca'],
      [580, 'Cadereyta'],
      [580, 'Cd. Guadalupe'],
      [580, 'General Escobedo'],
      [580, 'Monterrey'],
      [580, 'San Nicolás de los Garza'],
      [580, 'San Pedro Garza García'],
      [580, 'Santa Catarina'],
      [583, 'Allende'],
      [592, 'General Zuazua'],
      [595, 'Linares'],
      [597, 'Montemorelos'],
      [599, 'Sabinas Hidalgo'],
      [600, 'Salinas Victoria'],
      [601, 'El Cercado'],
      [601, 'Villa de Santiago'],
      [610, 'Oaxaca'],
      [613, 'Tlaxiaco'],
      [614, 'Huajuapan de León'],
      [616, 'Ixtepec'],
      [617, 'Juchitán'],
      [619, 'Loma Bonita'],
      [620, 'Matías Romero'],
      [621, 'Miahuatlán'],
      [622, 'Ocotlán [alternate]'],  //see first occurrence at 370
      [624, 'Puerto Escondido'],
      [626, 'Salina Cruz'],
      [627, 'Lagunas'],
      [628, 'Tuxtepec'],
      [630, 'Pochutla'],
      [631, 'San Pedro Tapanatepec'],
      [632, 'Santa Lucía del Camino'],
      [634, 'Bahías de Huatulco'],
      [635, 'Santiago Juxtlahuaca'],
      [636, 'Pinotepa Nacional'],
      [637, 'Tehuantepec'],
      [638, 'Tlacolula'],
      [640, 'Zimatlán'],
      [650, 'Cholula'],
      [650, 'La Resurrección'],
      [650, 'Puebla'],
      [650, 'San Baltazar Campeche'],
      [651, 'N/A'],
      [652, 'Acatzingo'],
      [654, 'Atlixco'],
      [656, 'Cuetzalan'],
      [659, 'Huauchinango'],
      [662, 'Izúcar de Matamoros'],
      [667, 'San Martín Texmelucan'],
      [668, 'San Felipe Hueyotlipan'],
      [669, 'Tecamachalco'],
      [670, 'Tehuacán'],
      [671, 'San Lorenzo'],
      [672, 'Teziutlán'],
      [674, 'Xicotepec de Juárez'],
      [676, 'Zacatlán'],
      [680, 'Pedro Escobedo'],
      [680, 'Querétaro'],
      [680, 'Villa Corregidora'],
      [681, 'Amealco'],
      [685, 'San Juan del Río'],
      [686, 'Tequisquiapan'],
      [690, 'Chetumal'],
      [691, 'Cancún'],
      [691, 'Col. Puerto Juárez'],
      [692, 'Cozumel'],
      [693, 'N/A'],
      [694, 'Playa del Carmen'],
      [700, 'San Luis Potosí'],
      [703, 'Cerritos'],
      [705, 'Ciudad Valles'],
      [709, 'Matehuala'],
      [711, 'Río Verde'],
      [716, 'Tamuín'],
      [730, 'Culiacán'],
      [735, 'Concordia'],
      [736, 'Cosala'],
      [737, 'Choix'],
      [738, 'El Fuerte'],
      [739, 'Escuinapa'],
      [740, 'Guamúchil'],
      [741, 'Guasave'],
      [743, 'Los Mochis'],
      [743, 'Topolobampo'],
      [744, 'Mazatlán'],
      [745, 'Mocorito'],
      [746, 'Navolato'],
      [760, 'Hermosillo'],
      [761, 'Agua Prieta'],
      [765, 'Caborca'],
      [766, 'Cananea'],
      [767, 'Ciudad Obregón'],
      [767, 'Esperanza'],
      [769, 'Empalme'],
      [770, 'Guaymas'],
      [770, 'San Carlos'],
      [771, 'Huatabampo'],
      [773, 'Magdalena'],
      [776, 'Nacozari de García'],
      [777, 'Navojoa'],
      [778, 'Nogales'],
      [779, 'Puerto Peñasco'],
      [780, 'San Luis Río Colorado'],
      [790, 'Tamulte'],
      [790, 'Villa Hermosa'],
      [792, 'Cárdenas'],
      [793, 'Ciudad Pemex'],
      [794, 'Comalcalco'],
      [796, 'Emiliano Zapata'],
      [797, 'Frontera'],
      [798, 'Huimanguillo'],
      [800, 'Jalpa de Méndez'],
      [802, 'Macuspana'],
      [803, 'Nacajuca'],
      [804, 'Paraíso'],
      [805, 'Tacotalpa'],
      [806, 'Teapa'],
      [807, 'Tenosique'],
      [810, 'Ciudad Victoria'],
      [811, 'Altamira'],
      [813, 'Ciudad Madero'],
      [813, 'Tampico'],
      [814, 'Ciudad Mante'],
      [818, 'Matamoros'],
      [821, 'Colombia'],
      [821, 'Nuevo Laredo'],
      [822, 'Reynosa'],
      [823, 'Río Bravo'],
      [825, 'Soto La Marina'],
      [826, 'Valle Hermoso'],
      [830, 'Tlaxcala'],
      [832, 'Apizaco'],
      [834, 'Santa Ana Chiautempan'],
      [840, 'Jalapa'],
      [841, 'Acayucan'],
      [843, 'Agua Dulce'],
      [845, 'Álamo'],
      [846, 'Altotonga'],
      [848, 'Banderilla'],
      [849, 'Boca del Río'],
      [852, 'Ciudad Mendoza'],
      [853, 'Coatepec'],
      [854, 'Coatzacoalcos'],
      [855, 'Córdoba'],
      [856, 'Cosamaloapan'],
      [860, 'Cuitláhuac'],
      [863, 'Fortín de las Flores'],
      [864, 'Gutiérrez Zamora'],
      [865, 'Huatusco'],
      [867, 'Isla'],
      [868, 'Ixtaczoquitlán'],
      [869, 'Jáltipan'],
      [871, 'Juan Rodríguez Clara'],
      [872, 'Villa José Cardel'],
      [873, 'Las Choapas'],
      [875, 'Naranjos'],
      [876, 'Martínez de la Torre'],
      [877, 'Minatitlán'],
      [878, 'Misantla'],
      [879, 'Nanchital'],
      [882, 'Orizaba'],
      [885, 'Papantla'],
      [886, 'Perote'],
      [888, 'Poza Rica'],
      [889, 'Río Blanco'],
      [890, 'San Andrés Tuxtla'],
      [891, 'San Rafael'],
      [894, 'Platón Sánchez'],
      [894, 'Tantoyuca'],
      [895, 'Tempoal'],
      [898, 'Tierra Blanca'],
      [901, 'Tlapacoyan'],
      [903, 'Túxpam de Rodríguez Cano'],
      [905, 'Cd. Industrial Framboyan'],
      [905, 'Veracruz'],
      [910, 'Mérida'],
      [913, 'Motul'],
      [914, 'Oxkutzcab'],
      [915, 'Progreso'],
      [917, 'Ticul'],
      [918, 'Tizimín'],
      [920, 'Valladolid'],
      [930, 'Zacatecas'],
      [933, 'Fresnillo'],
      [934, 'Guadalupe'],
      [935, 'Jalpa'],
      [936, 'Jerez de G. Salinas'],
      [938, 'Juchipila'],
      [939, 'Loreto'],
      [946, 'Nochistlán'],
      [958, 'Valparaíso'],
      [960, 'Calera de V. Rosales']
      ]

   };

if (typeof module === 'object')
   module.exports = clabe;  //Node.js module loading system (CommonJS)
