  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));

/* ===== */

const LANGS = {
  es: {
    nav_park:"Estacionar", nav_health:"Salud", nav_security:"Seguridad",
    nav_commerce:"Comercio", nav_pottery:"Alfarería", nav_food:"Comer",
    nav_around:"Alrededores", nav_plaza:"Plaza Pública", nav_map:"Mapa", nav_donate:"Apoyar",
    hero_tag:"📍 Pomaire · Melipilla · Región Metropolitana",
    hero_h1:"Bienvenido/a a <em>Pomaire</em>",
    hero_sub:"Todo lo que necesitas saber si estás de visita o acabas de llegar al pueblo alfarero más famoso de Chile. Servicios, emergencias, estacionamientos y mucho más.",
    cta_plan:"Planifica tu visita", cta_directions:"Cómo llegar", cta_eat:"Dónde comer",
    wa_text:"Compartir", wa_aria:"Compartir Pomaire 360 por WhatsApp",
    wa_share:"¡Descubre Pomaire, el pueblo alfarero más famoso de Chile! 🏺 Guía completa de servicios, gastronomía y turismo: https://pomaire360.cl/",
    emer_police:"🚔 133 Carabineros", emer_samu:"🚑 131 SAMU Ambulancia", emer_fire:"🚒 132 Bomberos", emer_peace:"🕊️ 149 Paz ciudadana",
    s_park_title:"Estacionamientos", s_park_sub:"Llegan miles de visitantes cada fin de semana — planifica dónde dejar tu auto",
    s_health_title:"Salud y urgencias médicas", s_health_sub:"CESFAM, hospital y SAMU para Pomaire y alrededores",
    s_sec_title:"Seguridad y emergencias", s_sec_sub:"Carabineros, Bomberos y líneas de apoyo",
    s_com_title:"Almacenes y servicios cotidianos", s_com_sub:"Lo básico para vivir o pasar el día en Pomaire",
    s_pot_title:"Alfarería — el corazón de Pomaire", s_pot_sub:"Talleres, compras y la tradición artesanal que define al pueblo",
    s_gas_title:"Gastronomía típica", s_gas_sub:"Sabores tradicionales en cazuela de greda",
    s_aro_title:"Alrededores de Pomaire", s_aro_sub:"Los Chiñihues y sectores cercanos que vale la pena conocer",
    s_pla_title:"Plaza y espacios públicos", s_pla_sub:"Puntos de encuentro y descanso en el corazón de Pomaire",
    s_map_title:"Pomaire en el mapa", s_map_sub:"Ubicación del pueblo y sus alrededores",
    s_don_title:"Apoya este proyecto", s_don_sub:"Guía gratuita, mantenida con voluntad y amor por Pomaire",
    donate_text:"Pomaire 360 es un proyecto independiente sin publicidad. Si te fue útil esta guía, un aporte voluntario ayuda a mantener la información actualizada. ¡Gracias!",
    donate_btn:"🏺 Hacer un aporte voluntario",
    donate_note:"Pago seguro con Mercado Pago · tarjeta, transferencia o billetera digital",
    emer_numbers:"Números de emergencia",
    footer_tagline:"Guía para visitantes y nuevos residentes",
    footer_emer:"Emergencias:",
    footer_disc:"Información de carácter orientativo. Verifica horarios y datos directamente con cada institución.",
    footer_date:"Última revisión: junio 2026 · Pomaire, Melipilla, Región Metropolitana",

    nav_weather:"Clima", nav_tour:"Recorrido", nav_gallery:"Galería", nav_events:"Eventos", nav_reviews:"Reseñas", nav_advertise:"Anúnciate",
    s_weather_title:"Clima en Pomaire ahora", s_weather_sub:"Condiciones actuales para planificar tu visita",
    weather_note:"Datos en tiempo real · Open-Meteo · Coordenadas Pomaire",
    s_tour_title:"Recorrido turístico paso a paso", s_tour_sub:"La ruta perfecta para aprovechar tu día en Pomaire",
    tour_1_title:"Llegada y estacionamiento", tour_1_desc:"Llega antes de las 10:00 para conseguir estacionamiento en calle Rafael Morandé.",
    tour_2_title:"Desayuno en la plaza", tour_2_desc:"Toma un café o desayuno liviano en algún local de la plaza central.",
    tour_3_title:"Recorre los talleres alfareros", tour_3_desc:"Camina por la calle principal y entra a los talleres. Mira a los artesanos trabajar en el torno.",
    tour_4_title:"Compras de artesanía", tour_4_desc:"Compra directamente a los artesanos. Jarras, cazuelas, tinajas y el famoso chanchito alcancía.",
    tour_5_title:"Almuerzo típico", tour_5_desc:"Disfruta una cazuela de vacuno o empanada gigante servida en recipiente de greda.",
    tour_6_title:"Paseo por los alrededores", tour_6_desc:"Date una vuelta por Los Chiñihues. Paisaje rural y tranquilidad a pocos minutos.",
    tour_7_title:"Regreso con recuerdos", tour_7_desc:"Última vuelta por los puestos. Muchos artesanos hacen descuentos al final del día.",
    s_gallery_title:"Galería de Pomaire", s_gallery_sub:"Imágenes del pueblo alfarero y sus tradiciones",
    gal_1:"Alfarería en greda", gal_2:"Cazuela de barro", gal_3:"Los Chiñihues",
    gal_4:"Calle principal", gal_5:"Artesanos trabajando", gal_6:"Iglesia San Antonio",
    gallery_note:"📷 ¿Visitaste Pomaire? Comparte tus fotos etiquetando #Pomaire360",
    s_events_title:"Eventos y fechas importantes", s_events_sub:"Festividades, ferias y celebraciones en Pomaire",
    ev_1_title:"Temporada alta de verano", ev_1_desc:"Mayor afluencia de turistas nacionales. Llegar temprano es clave.",
    ev_2_title:"Fiesta de San Antonio de Padua", ev_2_desc:"Festividad religiosa patronal. Procesión, actividades culturales y gastronomía especial.",
    ev_3_title:"Fiestas Patrias", ev_3_desc:"18 de septiembre — fondas, chicha artesanal, cueca y artesanía festiva.",
    ev_4_title:"Feria de artesanía navideña", ev_4_desc:"Nacimientos en greda, adornos y regalos únicos hechos a mano.",
    ev_tag_busy:"Alta demanda", ev_tag_fest:"Fiesta patronal", ev_tag_nat:"Fiestas patrias", ev_tag_xmas:"Navidad",
    s_reviews_title:"Lo que dicen los visitantes", s_reviews_sub:"Experiencias de quienes ya conocen Pomaire",
    rev_1_text:"\"Un lugar mágico. Los artesanos son increíblemente talentosos y la comida en cazuela de greda es algo que no se olvida.\"",
    rev_1_name:"María G.", rev_1_origin:" · Santiago",
    rev_2_text:"\"We came from Brazil and were amazed by the pottery tradition. The giant empanadas were delicious!\"",
    rev_2_name:"Carlos M.", rev_2_origin:" · Brasil",
    rev_3_text:"\"Llegamos con niños y fue perfecto. Ver cómo hacen las piezas en vivo los dejó fascinados.\"",
    rev_3_name:"Valentina R.", rev_3_origin:" · Valparaíso",
    rev_4_text:"\"美丽的陶艺村！陶艺师傅非常友好，食物也很美味。强烈推荐！\"",
    rev_4_name:"Wei L.", rev_4_origin:" · China",
    review_form_title:"¿Ya visitaste Pomaire? ¡Cuéntanos!",
    rev_ph_name:"Tu nombre", rev_ph_origin:"Tu ciudad / país", rev_ph_text:"Cuéntanos tu experiencia...",
    review_btn:"⭐ Publicar reseña",
    rev_local_note:"📝 Tu reseña se guarda solo en este navegador (aún no se comparten públicamente).",
    filter_all:"Todos", filter_parking:"Estacionar", filter_health:"Salud", filter_security:"Seguridad",
    filter_pottery:"Alfarería", filter_food:"Comer", filter_services:"Servicios", filter_around:"Alrededores",
    locate_btn:"Usar mi ubicación", map_hint:"📍 Activa tu ubicación o haz clic en un punto de partida en el mapa para calcular distancias",
    official_map_btn:"Ver mapa oficial ilustrado de Pomaire", official_map_note:"Plano turístico oficial con el directorio numerado de talleres de artesanos.", official_map_dl:"Descargar mapa",
    routes_title:"🧭 Recorridos sugeridos",
    route_artisan_name:"Ruta del Artesano", route_artisan_meta:"3 paradas · ~1.5 hrs",
    route_family_name:"Ruta Familiar", route_family_meta:"4 paradas · ~2.5 hrs",
    route_food_name:"Ruta Gastronómica", route_food_meta:"3 paradas · ~1 hr",
    route_nature_name:"Ruta Naturaleza", route_nature_meta:"3 paradas · ~3 hrs",
    route_clear:"Quitar ruta"
  },
  en: {
    nav_park:"Parking", nav_health:"Health", nav_security:"Safety", nav_commerce:"Shops",
    nav_pottery:"Pottery", nav_food:"Eat", nav_around:"Around", nav_plaza:"Town Square",
    nav_map:"Map", nav_donate:"Support",
    hero_tag:"📍 Pomaire · Melipilla · Metropolitan Region",
    hero_h1:"Welcome to <em>Pomaire</em>",
    hero_sub:"Everything you need to know if you're visiting or just moved to the most famous pottery village in Chile. Services, emergencies, parking and much more.",
    cta_plan:"Plan your visit", cta_directions:"How to get there", cta_eat:"Where to eat",
    wa_text:"Share", wa_aria:"Share Pomaire 360 on WhatsApp",
    wa_share:"Discover Pomaire, Chile's most famous pottery village! 🏺 Complete guide to services, food and tourism: https://pomaire360.cl/",
    emer_police:"🚔 133 Police", emer_samu:"🚑 131 Ambulance", emer_fire:"🚒 132 Fire Dept.", emer_peace:"🕊️ 149 Citizens' Line",
    s_park_title:"Parking", s_park_sub:"Thousands of visitors arrive every weekend — plan where to park your car",
    s_health_title:"Health & Medical Emergencies", s_health_sub:"CESFAM clinic, hospital and ambulance for Pomaire and surroundings",
    s_sec_title:"Safety & Emergencies", s_sec_sub:"Police, Fire Department and support lines",
    s_com_title:"Shops & Everyday Services", s_com_sub:"The basics for living or spending the day in Pomaire",
    s_pot_title:"Pottery — the heart of Pomaire", s_pot_sub:"Workshops, shopping and the craft tradition that defines this village",
    s_gas_title:"Traditional Food", s_gas_sub:"Traditional flavours served in clay pots",
    s_aro_title:"Around Pomaire", s_aro_sub:"Los Chiñihues and nearby areas worth exploring",
    s_pla_title:"Town Square & Public Spaces", s_pla_sub:"Meeting points and rest areas in the heart of Pomaire",
    s_map_title:"Pomaire on the Map", s_map_sub:"Village location and surroundings",
    s_don_title:"Support this Project", s_don_sub:"Free guide, maintained with dedication and love for Pomaire",
    donate_text:"Pomaire 360 is an independent, ad-free project. If this guide was helpful, a voluntary contribution helps keep the information updated. Thank you!",
    donate_btn:"🏺 Make a voluntary contribution",
    donate_note:"Secure payment via Mercado Pago · card, bank transfer or digital wallet",
    emer_numbers:"Emergency Numbers",
    footer_tagline:"Guide for visitors and new residents",
    footer_emer:"Emergencies:",
    footer_disc:"Information is for guidance only. Please verify hours and details directly with each institution.",
    footer_date:"Last updated: June 2026 · Pomaire, Melipilla, Metropolitan Region",

    nav_weather:"Weather", nav_tour:"Tour", nav_gallery:"Gallery", nav_events:"Events", nav_reviews:"Reviews", nav_advertise:"Advertise",
    s_weather_title:"Current Weather in Pomaire", s_weather_sub:"Real-time conditions to plan your visit",
    weather_note:"Live data · Open-Meteo · Pomaire coordinates",
    s_tour_title:"Step-by-step tourist route", s_tour_sub:"The perfect itinerary to make the most of your day in Pomaire",
    tour_1_title:"Arrival & Parking", tour_1_desc:"Arrive before 10:00 to find parking on Rafael Morandé street. Weekends fill up fast.",
    tour_2_title:"Breakfast at the square", tour_2_desc:"Grab a coffee or light breakfast at one of the plaza's cafés before the crowds arrive.",
    tour_3_title:"Explore the pottery workshops", tour_3_desc:"Walk the main street and enter the workshops. Watch artisans work on the potter's wheel.",
    tour_4_title:"Craft shopping", tour_4_desc:"Buy directly from the artisans. Clay jugs, bowls, jars and the famous clay piggy bank.",
    tour_5_title:"Traditional lunch", tour_5_desc:"Enjoy a beef cazuela or giant empanada served in a clay vessel — Pomaire's most iconic dish!",
    tour_6_title:"Explore the surroundings", tour_6_desc:"Drive to Los Chiñihues for rural scenery, vineyards and peace just minutes away.",
    tour_7_title:"Head home with souvenirs", tour_7_desc:"Last stroll through the stalls. Many artisans offer discounts late in the day.",
    s_gallery_title:"Pomaire Gallery", s_gallery_sub:"Images of the pottery village and its traditions",
    gal_1:"Clay pottery", gal_2:"Clay pot stew", gal_3:"Los Chiñihues",
    gal_4:"Main street", gal_5:"Artisans at work", gal_6:"San Antonio Church",
    gallery_note:"📷 Visited Pomaire? Share your photos tagging #Pomaire360",
    s_events_title:"Events & Important Dates", s_events_sub:"Festivals, fairs and celebrations in Pomaire",
    ev_1_title:"Summer high season", ev_1_desc:"Peak domestic tourism. Arrive early. Artisans have more stock and variety.",
    ev_2_title:"Feast of Saint Anthony", ev_2_desc:"Patron saint festival with procession, cultural activities and special food in the plaza.",
    ev_3_title:"National Holidays (Fiestas Patrias)", ev_3_desc:"September 18th — traditional food stalls, artisan chicha, cueca dancing.",
    ev_4_title:"Christmas craft fair", ev_4_desc:"Special seasonal pieces: clay nativity scenes, ornaments and handmade unique gifts.",
    ev_tag_busy:"High demand", ev_tag_fest:"Patron feast", ev_tag_nat:"National holidays", ev_tag_xmas:"Christmas",
    s_reviews_title:"What visitors say", s_reviews_sub:"Experiences from people who have already visited Pomaire",
    rev_1_text:"\"A magical place. The artisans are incredibly talented and the food in a clay pot is something you won't forget.\"",
    rev_1_name:"María G.", rev_1_origin:" · Santiago",
    rev_2_text:"\"We came from Brazil and were amazed by the pottery tradition. The giant empanadas were delicious!\"",
    rev_2_name:"Carlos M.", rev_2_origin:" · Brazil",
    rev_3_text:"\"We came with kids and it was perfect. Watching the clay pieces being made live left them fascinated.\"",
    rev_3_name:"Valentina R.", rev_3_origin:" · Valparaíso",
    rev_4_text:"\"Beautiful pottery village! The artisans were very friendly and the food was delicious. Highly recommended!\"",
    rev_4_name:"Wei L.", rev_4_origin:" · China",
    review_form_title:"Already visited Pomaire? Tell us!",
    rev_ph_name:"Your name", rev_ph_origin:"Your city / country", rev_ph_text:"Share your experience...",
    review_btn:"⭐ Post review",
    rev_local_note:"📝 Your review is saved only in this browser (reviews are not shared publicly yet).",
    filter_all:"All", filter_parking:"Parking", filter_health:"Health", filter_security:"Safety",
    filter_pottery:"Pottery", filter_food:"Eat", filter_services:"Services", filter_around:"Around",
    locate_btn:"Use my location", map_hint:"📍 Enable your location or click a starting point on the map to calculate distances",
    official_map_btn:"View official illustrated map of Pomaire", official_map_note:"Official tourist map with the numbered directory of artisan workshops.", official_map_dl:"Download map",
    routes_title:"🧭 Suggested Routes",
    route_artisan_name:"Artisan Route", route_artisan_meta:"3 stops · ~1.5 hrs",
    route_family_name:"Family Route", route_family_meta:"4 stops · ~2.5 hrs",
    route_food_name:"Food Route", route_food_meta:"3 stops · ~1 hr",
    route_nature_name:"Nature Route", route_nature_meta:"3 stops · ~3 hrs",
    route_clear:"Clear route"
  },
  pt: {
    nav_park:"Estacionar", nav_health:"Saúde", nav_security:"Segurança", nav_commerce:"Comércio",
    nav_pottery:"Olaria", nav_food:"Comer", nav_around:"Arredores", nav_plaza:"Praça",
    nav_map:"Mapa", nav_donate:"Apoiar",
    hero_tag:"📍 Pomaire · Melipilla · Região Metropolitana",
    hero_h1:"Bem-vindo/a a <em>Pomaire</em>",
    hero_sub:"Tudo o que você precisa saber se está visitando ou acabou de chegar à vila de cerâmica mais famosa do Chile. Serviços, emergências, estacionamento e muito mais.",
    cta_plan:"Planeje sua visita", cta_directions:"Como chegar", cta_eat:"Onde comer",
    wa_text:"Compartilhar", wa_aria:"Compartilhar Pomaire 360 no WhatsApp",
    wa_share:"Descubra Pomaire, a vila de cerâmica mais famosa do Chile! 🏺 Guia completo de serviços, gastronomia e turismo: https://pomaire360.cl/",
    emer_police:"🚔 133 Polícia", emer_samu:"🚑 131 Ambulância", emer_fire:"🚒 132 Bombeiros", emer_peace:"🕊️ 149 Linha Cidadã",
    s_park_title:"Estacionamento", s_park_sub:"Milhares de visitantes chegam todo fim de semana — planeje onde deixar seu carro",
    s_health_title:"Saúde e Urgências Médicas", s_health_sub:"Posto de saúde, hospital e SAMU para Pomaire e arredores",
    s_sec_title:"Segurança e Emergências", s_sec_sub:"Polícia, Bombeiros e linhas de apoio",
    s_com_title:"Mercados e Serviços do Dia a Dia", s_com_sub:"O essencial para viver ou passar o dia em Pomaire",
    s_pot_title:"Olaria — o coração de Pomaire", s_pot_sub:"Ateliês, compras e a tradição artesanal que define a vila",
    s_gas_title:"Gastronomia Típica", s_gas_sub:"Sabores tradicionais em panela de barro",
    s_aro_title:"Arredores de Pomaire", s_aro_sub:"Los Chiñihues e setores próximos que vale a pena conhecer",
    s_pla_title:"Praça e Espaços Públicos", s_pla_sub:"Pontos de encontro e descanso no coração de Pomaire",
    s_map_title:"Pomaire no Mapa", s_map_sub:"Localização da vila e arredores",
    s_don_title:"Apoie este Projeto", s_don_sub:"Guia gratuito, mantido com dedicação e amor por Pomaire",
    donate_text:"Pomaire 360 é um projeto independente sem publicidade. Se este guia foi útil, uma contribuição voluntária ajuda a manter as informações atualizadas. Obrigado!",
    donate_btn:"🏺 Fazer uma contribuição voluntária",
    donate_note:"Pagamento seguro via Mercado Pago · cartão, transferência ou carteira digital",
    emer_numbers:"Números de Emergência",
    footer_tagline:"Guia para visitantes e novos moradores",
    footer_emer:"Emergências:",
    footer_disc:"As informações são apenas orientativas. Verifique horários e dados diretamente com cada instituição.",
    footer_date:"Última atualização: junho 2026 · Pomaire, Melipilla, Região Metropolitana",
    nav_weather:"Clima", nav_tour:"Roteiro", nav_gallery:"Galeria", nav_events:"Eventos", nav_reviews:"Avaliações", nav_advertise:"Anuncie",
    s_weather_title:"Clima em Pomaire agora", s_weather_sub:"Condições atuais para planejar sua visita",
    weather_note:"Dados em tempo real · Open-Meteo · Coordenadas de Pomaire",
    s_tour_title:"Roteiro turístico passo a passo", s_tour_sub:"O itinerário perfeito para aproveitar seu dia em Pomaire",
    tour_1_title:"Chegada e estacionamento", tour_1_desc:"Chegue antes das 10h para conseguir estacionamento na rua Rafael Morandé.",
    tour_2_title:"Café da manhã na praça", tour_2_desc:"Tome um café ou um café da manhã leve em um dos locais da praça central.",
    tour_3_title:"Visite as olarias", tour_3_desc:"Caminhe pela rua principal e entre nos ateliês. Veja os artesãos trabalhando no torno.",
    tour_4_title:"Compras de artesanato", tour_4_desc:"Compre diretamente dos artesãos. Jarros, panelas, potes e o famoso porquinho cofre de barro.",
    tour_5_title:"Almoço típico", tour_5_desc:"Desfrute de uma cazuela de boi ou empanada gigante servida em recipiente de barro.",
    tour_6_title:"Passeio pelos arredores", tour_6_desc:"Dê uma volta por Los Chiñihues. Paisagem rural e tranquilidade a poucos minutos.",
    tour_7_title:"Volta com lembranças", tour_7_desc:"Última passada pelas barracas. Muitos artesãos fazem descontos no final do dia.",
    s_gallery_title:"Galeria de Pomaire", s_gallery_sub:"Imagens da vila de cerâmica e suas tradições",
    gal_1:"Cerâmica de barro", gal_2:"Cazuela de barro", gal_3:"Los Chiñihues",
    gal_4:"Rua principal", gal_5:"Artesãos trabalhando", gal_6:"Igreja Santo Antônio",
    gallery_note:"📷 Visitou Pomaire? Compartilhe suas fotos marcando #Pomaire360",
    s_events_title:"Eventos e datas importantes", s_events_sub:"Festividades, feiras e celebrações em Pomaire",
    ev_1_title:"Alta temporada de verão", ev_1_desc:"Maior fluxo de turistas nacionais. Chegar cedo é essencial.",
    ev_2_title:"Festa de Santo Antônio de Pádua", ev_2_desc:"Festividade religiosa padroeira. Procissão, atividades culturais e gastronomia especial.",
    ev_3_title:"Fiestas Patrias (Independência)", ev_3_desc:"18 de setembro — barracas tradicionais, chicha artesanal, dança cueca.",
    ev_4_title:"Feira de artesanato de Natal", ev_4_desc:"Peças sazonais especiais: presépios de barro, ornamentos e presentes únicos feitos à mão.",
    ev_tag_busy:"Alta demanda", ev_tag_fest:"Festa padroeira", ev_tag_nat:"Fiestas Patrias", ev_tag_xmas:"Natal",
    s_reviews_title:"O que dizem os visitantes", s_reviews_sub:"Experiências de quem já visitou Pomaire",
    rev_1_text:"\"Um lugar mágico. Os artesãos são incrivelmente talentosos e a comida na cazuela de barro é algo inesquecível.\"",
    rev_1_name:"María G.", rev_1_origin:" · Santiago",
    rev_2_text:"\"We came from Brazil and were amazed by the pottery tradition. The giant empanadas were delicious!\"",
    rev_2_name:"Carlos M.", rev_2_origin:" · Brasil",
    rev_3_text:"\"Viemos com crianças e foi perfeito. Ver as peças de barro sendo feitas ao vivo as deixou fascinadas.\"",
    rev_3_name:"Valentina R.", rev_3_origin:" · Valparaíso",
    rev_4_text:"\"美丽的陶艺村！陶艺师傅非常友好，食物也很美味。强烈推荐！\"",
    rev_4_name:"Wei L.", rev_4_origin:" · China",
    review_form_title:"Já visitou Pomaire? Conte para nós!",
    rev_ph_name:"Seu nome", rev_ph_origin:"Sua cidade / país", rev_ph_text:"Conte sua experiência...",
    review_btn:"⭐ Publicar avaliação",
    rev_local_note:"📝 Sua avaliação fica salva apenas neste navegador (ainda não são compartilhadas publicamente).",
    filter_all:"Todos", filter_parking:"Estacionar", filter_health:"Saúde", filter_security:"Segurança",
    filter_pottery:"Olaria", filter_food:"Comer", filter_services:"Serviços", filter_around:"Arredores",
    locate_btn:"Usar minha localização", map_hint:"📍 Ative sua localização ou clique em um ponto de partida no mapa para calcular distâncias",
    official_map_btn:"Ver mapa oficial ilustrado de Pomaire", official_map_note:"Mapa turístico oficial com o diretório numerado das oficinas de artesãos.", official_map_dl:"Baixar mapa",
    routes_title:"🧭 Roteiros sugeridos",
    route_artisan_name:"Rota do Artesão", route_artisan_meta:"3 paradas · ~1,5h",
    route_family_name:"Rota Familiar", route_family_meta:"4 paradas · ~2,5h",
    route_food_name:"Rota Gastronômica", route_food_meta:"3 paradas · ~1h",
    route_nature_name:"Rota Natureza", route_nature_meta:"3 paradas · ~3h",
    route_clear:"Remover rota"
  },
  fr: {
    nav_park:"Parking", nav_health:"Santé", nav_security:"Sécurité", nav_commerce:"Commerces",
    nav_pottery:"Poterie", nav_food:"Manger", nav_around:"Alentours", nav_plaza:"Place",
    nav_map:"Carte", nav_donate:"Soutenir",
    hero_tag:"📍 Pomaire · Melipilla · Région Métropolitaine",
    hero_h1:"Bienvenue à <em>Pomaire</em>",
    hero_sub:"Tout ce que vous devez savoir si vous visitez ou venez d'arriver dans le village de poterie le plus célèbre du Chili. Services, urgences, parking et bien plus.",
    cta_plan:"Planifiez votre visite", cta_directions:"Comment venir", cta_eat:"Où manger",
    wa_text:"Partager", wa_aria:"Partager Pomaire 360 sur WhatsApp",
    wa_share:"Découvrez Pomaire, le village de poterie le plus célèbre du Chili ! 🏺 Guide complet des services, de la gastronomie et du tourisme : https://pomaire360.cl/",
    emer_police:"🚔 133 Police", emer_samu:"🚑 131 Ambulance", emer_fire:"🚒 132 Pompiers", emer_peace:"🕊️ 149 Ligne Citoyenne",
    s_park_title:"Parking", s_park_sub:"Des milliers de visiteurs arrivent chaque week-end — planifiez où garer votre voiture",
    s_health_title:"Santé et Urgences Médicales", s_health_sub:"Clinique, hôpital et SAMU pour Pomaire et ses environs",
    s_sec_title:"Sécurité et Urgences", s_sec_sub:"Police, Pompiers et lignes d'assistance",
    s_com_title:"Épiceries et Services Quotidiens", s_com_sub:"L'essentiel pour vivre ou passer la journée à Pomaire",
    s_pot_title:"Poterie — le cœur de Pomaire", s_pot_sub:"Ateliers, achats et tradition artisanale qui définit ce village",
    s_gas_title:"Gastronomie Typique", s_gas_sub:"Saveurs traditionnelles dans des plats en argile",
    s_aro_title:"Autour de Pomaire", s_aro_sub:"Los Chiñihues et les environs qui méritent le détour",
    s_pla_title:"Place et Espaces Publics", s_pla_sub:"Points de rencontre et de repos au cœur de Pomaire",
    s_map_title:"Pomaire sur la Carte", s_map_sub:"Localisation du village et de ses environs",
    s_don_title:"Soutenez ce Projet", s_don_sub:"Guide gratuit, maintenu avec dévouement et amour pour Pomaire",
    donate_text:"Pomaire 360 est un projet indépendant sans publicité. Si ce guide vous a été utile, une contribution volontaire aide à maintenir les informations à jour. Merci !",
    donate_btn:"🏺 Faire une contribution volontaire",
    donate_note:"Paiement sécurisé via Mercado Pago · carte, virement ou portefeuille numérique",
    emer_numbers:"Numéros d'Urgence",
    footer_tagline:"Guide pour visiteurs et nouveaux résidents",
    footer_emer:"Urgences :",
    footer_disc:"Les informations sont indicatives. Vérifiez les horaires et détails directement avec chaque institution.",
    footer_date:"Dernière mise à jour : juin 2026 · Pomaire, Melipilla, Région Métropolitaine",
    nav_weather:"Météo", nav_tour:"Itinéraire", nav_gallery:"Galerie", nav_events:"Événements", nav_reviews:"Avis", nav_advertise:"Annoncez",
    s_weather_title:"Météo à Pomaire en direct", s_weather_sub:"Conditions actuelles pour planifier votre visite",
    weather_note:"Données en direct · Open-Meteo · Coordonnées de Pomaire",
    s_tour_title:"Itinéraire touristique étape par étape", s_tour_sub:"Le parcours parfait pour profiter de votre journée à Pomaire",
    tour_1_title:"Arrivée et stationnement", tour_1_desc:"Arrivez avant 10h pour trouver une place rue Rafael Morandé.",
    tour_2_title:"Petit-déjeuner sur la place", tour_2_desc:"Prenez un café ou un petit-déjeuner léger dans un café de la place centrale.",
    tour_3_title:"Visitez les ateliers de poterie", tour_3_desc:"Parcourez la rue principale et entrez dans les ateliers. Regardez les artisans travailler.",
    tour_4_title:"Achats d'artisanat", tour_4_desc:"Achetez directement auprès des artisans. Cruches, bols, jarres et la célèbre tirelire en argile.",
    tour_5_title:"Déjeuner typique", tour_5_desc:"Dégustez une cazuela de bœuf ou une empanada géante servie dans un récipient en argile.",
    tour_6_title:"Promenade aux alentours", tour_6_desc:"Faites un tour à Los Chiñihues. Paysage rural et tranquillité à quelques minutes.",
    tour_7_title:"Retour avec des souvenirs", tour_7_desc:"Dernier tour des stands. Beaucoup d'artisans offrent des réductions en fin de journée.",
    s_gallery_title:"Galerie de Pomaire", s_gallery_sub:"Images du village de poterie et de ses traditions",
    gal_1:"Poterie en argile", gal_2:"Cazuela en argile", gal_3:"Los Chiñihues",
    gal_4:"Rue principale", gal_5:"Artisans au travail", gal_6:"Église Saint-Antoine",
    gallery_note:"📷 Vous avez visité Pomaire ? Partagez vos photos avec #Pomaire360",
    s_events_title:"Événements et dates importantes", s_events_sub:"Festivités, foires et célébrations à Pomaire",
    ev_1_title:"Haute saison d'été", ev_1_desc:"Forte affluence de touristes nationaux. Arriver tôt est essentiel.",
    ev_2_title:"Fête de Saint-Antoine de Padoue", ev_2_desc:"Fête patronale religieuse. Procession, activités culturelles et gastronomie spéciale.",
    ev_3_title:"Fêtes nationales (Fiestas Patrias)", ev_3_desc:"18 septembre — stands traditionnels, chicha artisanale, danse cueca.",
    ev_4_title:"Foire artisanale de Noël", ev_4_desc:"Pièces saisonnières spéciales : crèches en argile, ornements et cadeaux uniques faits à la main.",
    ev_tag_busy:"Forte demande", ev_tag_fest:"Fête patronale", ev_tag_nat:"Fêtes nationales", ev_tag_xmas:"Noël",
    s_reviews_title:"Ce que disent les visiteurs", s_reviews_sub:"Expériences de ceux qui ont déjà visité Pomaire",
    rev_1_text:"\"Un endroit magique. Les artisans sont incroyablement talentueux et la nourriture dans un plat en argile est inoubliable.\"",
    rev_1_name:"María G.", rev_1_origin:" · Santiago",
    rev_2_text:"\"We came from Brazil and were amazed by the pottery tradition. The giant empanadas were delicious!\"",
    rev_2_name:"Carlos M.", rev_2_origin:" · Brésil",
    rev_3_text:"\"Nous sommes venus avec des enfants et c'était parfait. Les voir fabriquer les pièces en direct les a fascinés.\"",
    rev_3_name:"Valentina R.", rev_3_origin:" · Valparaíso",
    rev_4_text:"\"美丽的陶艺村！陶艺师傅非常友好，食物也很美味。强烈推荐！\"",
    rev_4_name:"Wei L.", rev_4_origin:" · Chine",
    review_form_title:"Vous avez déjà visité Pomaire ? Dites-nous tout !",
    rev_ph_name:"Votre nom", rev_ph_origin:"Votre ville / pays", rev_ph_text:"Partagez votre expérience...",
    review_btn:"⭐ Publier un avis",
    rev_local_note:"📝 Votre avis est enregistré uniquement dans ce navigateur (pas encore partagé publiquement).",
    filter_all:"Tous", filter_parking:"Parking", filter_health:"Santé", filter_security:"Sécurité",
    filter_pottery:"Poterie", filter_food:"Manger", filter_services:"Services", filter_around:"Alentours",
    locate_btn:"Utiliser ma position", map_hint:"📍 Activez votre position ou cliquez sur un point de départ sur la carte pour calculer les distances",
    official_map_btn:"Voir le plan officiel illustré de Pomaire", official_map_note:"Plan touristique officiel avec l'annuaire numéroté des ateliers d'artisans.", official_map_dl:"Télécharger le plan",
    routes_title:"🧭 Itinéraires suggérés",
    route_artisan_name:"Route de l'Artisan", route_artisan_meta:"3 arrêts · ~1h30",
    route_family_name:"Route Familiale", route_family_meta:"4 arrêts · ~2h30",
    route_food_name:"Route Gastronomique", route_food_meta:"3 arrêts · ~1h",
    route_nature_name:"Route Nature", route_nature_meta:"3 arrêts · ~3h",
    route_clear:"Effacer l'itinéraire"
  },
  ru: {
    nav_park:"Парковка", nav_health:"Здоровье", nav_security:"Безопасность", nav_commerce:"Магазины",
    nav_pottery:"Керамика", nav_food:"Еда", nav_around:"Окрестности", nav_plaza:"Площадь",
    nav_map:"Карта", nav_donate:"Поддержать",
    hero_tag:"📍 Помайре · Мелипилья · Столичный регион",
    hero_h1:"Добро пожаловать в <em>Помайре</em>",
    hero_sub:"Всё, что нужно знать при посещении или переезде в самую известную гончарную деревню Чили. Услуги, экстренные службы, парковка и многое другое.",
    cta_plan:"Спланируйте визит", cta_directions:"Как добраться", cta_eat:"Где поесть",
    wa_text:"Поделиться", wa_aria:"Поделиться Pomaire 360 в WhatsApp",
    wa_share:"Откройте для себя Помайре — самую известную гончарную деревню Чили! 🏺 Полный гид по услугам, кухне и туризму: https://pomaire360.cl/",
    emer_police:"🚔 133 Полиция", emer_samu:"🚑 131 Скорая помощь", emer_fire:"🚒 132 Пожарная", emer_peace:"🕊️ 149 Гражданская линия",
    s_park_title:"Парковка", s_park_sub:"Тысячи туристов приезжают каждые выходные — планируйте парковку заранее",
    s_health_title:"Здоровье и медицинские экстренные случаи", s_health_sub:"Медпункт, больница и скорая помощь для Помайре и окрестностей",
    s_sec_title:"Безопасность и экстренные службы", s_sec_sub:"Полиция, пожарная охрана и линии поддержки",
    s_com_title:"Магазины и повседневные услуги", s_com_sub:"Всё необходимое для жизни или дневного визита в Помайре",
    s_pot_title:"Гончарное дело — сердце Помайре", s_pot_sub:"Мастерские, покупки и ремесленные традиции деревни",
    s_gas_title:"Традиционная кухня", s_gas_sub:"Традиционные блюда в глиняной посуде",
    s_aro_title:"Окрестности Помайре", s_aro_sub:"Лос-Чиньихуэс и близлежащие места, которые стоит посетить",
    s_pla_title:"Площадь и общественные пространства", s_pla_sub:"Места встреч и отдыха в сердце Помайре",
    s_map_title:"Помайре на карте", s_map_sub:"Расположение деревни и окрестностей",
    s_don_title:"Поддержите этот проект", s_don_sub:"Бесплатный путеводитель, поддерживаемый с любовью к Помайре",
    donate_text:"Pomaire 360 — независимый проект без рекламы. Если это руководство оказалось полезным, добровольный взнос поможет поддерживать информацию актуальной. Спасибо!",
    donate_btn:"🏺 Сделать добровольный взнос",
    donate_note:"Безопасная оплата через Mercado Pago · карта, перевод или цифровой кошелёк",
    emer_numbers:"Экстренные номера",
    footer_tagline:"Путеводитель для туристов и новых жителей",
    footer_emer:"Экстренные службы:",
    footer_disc:"Информация носит ориентировочный характер. Уточняйте расписание непосредственно в учреждениях.",
    footer_date:"Последнее обновление: июнь 2026 · Помайре, Мелипилья, Столичный регион",
    nav_weather:"Погода", nav_tour:"Маршрут", nav_gallery:"Галерея", nav_events:"События", nav_reviews:"Отзывы", nav_advertise:"Реклама",
    s_weather_title:"Погода в Помайре сейчас", s_weather_sub:"Текущие условия для планирования визита",
    weather_note:"Данные в реальном времени · Open-Meteo · Координаты Помайре",
    s_tour_title:"Туристический маршрут по шагам", s_tour_sub:"Идеальный маршрут, чтобы провести день в Помайре",
    tour_1_title:"Прибытие и парковка", tour_1_desc:"Приезжайте до 10:00, чтобы найти парковку на улице РафаэльМоранде.",
    tour_2_title:"Завтрак на площади", tour_2_desc:"Выпейте кофе или легкий завтрак в одном из кафе центральной площади.",
    tour_3_title:"Посетите гончарные мастерские", tour_3_desc:"Пройдитесь по главной улице и зайдите в мастерские. Посмотрите на работу гончаров.",
    tour_4_title:"Покупка изделий", tour_4_desc:"Покупайте напрямую у мастеров. Кувшины, чаши, кружки и знаменитая глиняная копилка.",
    tour_5_title:"Традиционный обед", tour_5_desc:"Попробуйте говяжье касуэла или гигантскую эмпанаду в глиняной посуде.",
    tour_6_title:"Прогулка по окрестностям", tour_6_desc:"Съездите в Лос-Чиньихуэс — сельские пейзажи и спокойствие в нескольких минутах.",
    tour_7_title:"Возвращение с подарками", tour_7_desc:"Последний обход лавок. Многие мастера дают скидки к концу дня.",
    s_gallery_title:"Галерея Помайре", s_gallery_sub:"Изображения гончарной деревни и её традиций",
    gal_1:"Глиняная керамика", gal_2:"Касуэла из глины", gal_3:"Лос-Чиньихуэс",
    gal_4:"Главная улица", gal_5:"Мастера за работой", gal_6:"Церковь Святого Антония",
    gallery_note:"📷 Посетили Помайре? Делитесь фото с хэштегом #Pomaire360",
    s_events_title:"События и важные даты", s_events_sub:"Праздники, ярмарки и торжества в Помайре",
    ev_1_title:"Высокий летний сезон", ev_1_desc:"Пик внутреннего туризма. Важно приезжать рано.",
    ev_2_title:"Праздник Святого Антония", ev_2_desc:"Праздник покровителя с процессией, культурными мероприятиями и особой кухней.",
    ev_3_title:"Национальные праздники (Fiestas Patrias)", ev_3_desc:"18 сентября — традиционные палатки, чича, танец куэка.",
    ev_4_title:"Рождественская ярмарка ремёсел", ev_4_desc:"Особые сезонные изделия: глиняные рождественские сцены, украшения и подарки.",
    ev_tag_busy:"Высокий спрос", ev_tag_fest:"Праздник покровителя", ev_tag_nat:"Национальные праздники", ev_tag_xmas:"Рождество",
    s_reviews_title:"Что говорят посетители", s_reviews_sub:"Впечатления тех, кто уже посетил Помайре",
    rev_1_text:"\"Волшебное место. Мастера невероятно талантливы, а еда в глиняной посуде незабываема.\"",
    rev_1_name:"María G.", rev_1_origin:" · Сантьяго",
    rev_2_text:"\"We came from Brazil and were amazed by the pottery tradition. The giant empanadas were delicious!\"",
    rev_2_name:"Carlos M.", rev_2_origin:" · Бразилия",
    rev_3_text:"\"Мы приехали с детьми, и это было идеально. Им было интересно наблюдать за изготовлением изделий.\"",
    rev_3_name:"Valentina R.", rev_3_origin:" · Вальпараисо",
    rev_4_text:"\"美丽的陶艺村！陶艺师傅非常友好，食物也很美味。强烈推荐！\"",
    rev_4_name:"Wei L.", rev_4_origin:" · Китай",
    review_form_title:"Уже посетили Помайре? Расскажите нам!",
    rev_ph_name:"Ваше имя", rev_ph_origin:"Ваш город / страна", rev_ph_text:"Поделитесь своими впечатлениями...",
    review_btn:"⭐ Опубликовать отзыв",
    rev_local_note:"📝 Ваш отзыв сохраняется только в этом браузере (пока не публикуется для всех).",
    filter_all:"Все", filter_parking:"Парковка", filter_health:"Здоровье", filter_security:"Безопасность",
    filter_pottery:"Керамика", filter_food:"Еда", filter_services:"Услуги", filter_around:"Окрестности",
    locate_btn:"Использовать моё местоположение", map_hint:"📍 Включите геолокацию или нажмите на карту, чтобы задать точку отправления",
    official_map_btn:"Посмотреть официальную иллюстрированную карту Помайре", official_map_note:"Официальная туристическая карта с нумерованным каталогом мастерских ремесленников.", official_map_dl:"Скачать карту",
    routes_title:"🧭 Предложенные маршруты",
    route_artisan_name:"Маршрут ремесленника", route_artisan_meta:"3 точки · ~1.5 ч",
    route_family_name:"Семейный маршрут", route_family_meta:"4 точки · ~2.5 ч",
    route_food_name:"Гастрономический маршрут", route_food_meta:"3 точки · ~1 ч",
    route_nature_name:"Природный маршрут", route_nature_meta:"3 точки · ~3 ч",
    route_clear:"Убрать маршрут"
  },
  ja: {
    nav_park:"駐車場", nav_health:"医療", nav_security:"安全", nav_commerce:"ショッピング",
    nav_pottery:"陶芸", nav_food:"グルメ", nav_around:"周辺", nav_plaza:"広場",
    nav_map:"地図", nav_donate:"サポート",
    hero_tag:"📍 ポマイレ · メリピジャ · 首都圏",
    hero_h1:"<em>ポマイレ</em>へようこそ",
    hero_sub:"チレで最も有名な陶芸の村を訪れる方、または新たに住み始めた方に必要な情報をすべてご案内します。サービス、緊急連絡先、駐車場など。",
    cta_plan:"訪問を計画する", cta_directions:"アクセス方法", cta_eat:"食事はこちら",
    wa_text:"シェア", wa_aria:"Pomaire 360 をWhatsAppでシェア",
    wa_share:"チレで最も有名な陶芸の村ポマイレを発見しよう！🏺 サービス・グルメ・観光の完全ガイド：https://pomaire360.cl/",
    emer_police:"🚔 133 警察", emer_samu:"🚑 131 救急車", emer_fire:"🚒 132 消防", emer_peace:"🕊️ 149 市民ライン",
    s_park_title:"駐車場", s_park_sub:"毎週末に何千人もの観光客が訪れます — 駐車場を事前に計画しましょう",
    s_health_title:"医療・緊急サービス", s_health_sub:"ポマイレ周辺のクリニック、病院、救急車",
    s_sec_title:"安全・緊急サービス", s_sec_sub:"警察、消防、サポートライン",
    s_com_title:"商店・日用サービス", s_com_sub:"ポマイレでの生活や日帰り訪問に必要な基本情報",
    s_pot_title:"陶芸 — ポマイレの心", s_pot_sub:"工房、ショッピング、村を象徴する伝統工芸",
    s_gas_title:"伝統料理", s_gas_sub:"土鍋で提供される伝統的な味",
    s_aro_title:"ポマイレ周辺", s_aro_sub:"ロス・チニュエスと近隣の見どころ",
    s_pla_title:"広場・公共スペース", s_pla_sub:"ポマイレの中心部にある集合・休憩スポット",
    s_map_title:"地図でポマイレを見る", s_map_sub:"村の位置と周辺",
    s_don_title:"このプロジェクトを支援する", s_don_sub:"ポマイレへの愛で維持される無料ガイド",
    donate_text:"Pomaire 360 は広告のない独立したプロジェクトです。このガイドが役に立ったなら、任意の寄付が情報の更新維持に役立ちます。ありがとうございます！",
    donate_btn:"🏺 任意寄付をする",
    donate_note:"Mercado Pago で安全に支払い · カード、送金、またはデジタルウォレット",
    emer_numbers:"緊急番号",
    footer_tagline:"観光客と新住民のためのガイド",
    footer_emer:"緊急連絡先：",
    footer_disc:"情報は目安です。時間や詳細は各機関に直接ご確認ください。",
    footer_date:"最終更新：2026年6月 · ポマイレ、メリピジャ、首都圏",
    nav_weather:"天気", nav_tour:"観光ルート", nav_gallery:"ギャラリー", nav_events:"イベント", nav_reviews:"レビュー", nav_advertise:"広告掲載",
    s_weather_title:"ポマイレの現在の天気", s_weather_sub:"訪問を計画するための現在の状況",
    weather_note:"リアルタイムデータ · Open-Meteo · ポマイレの座標",
    s_tour_title:"観光ルートをステップごとに", s_tour_sub:"ポマイレでの1日を最大限に楽しむための完璧な行程",
    tour_1_title:"到着と駐車", tour_1_desc:"ラファエル・モランデ通りの駐車場を確保するため10時前に到着しましょう。",
    tour_2_title:"広場での朝食", tour_2_desc:"中央広場のカフェでコーヒーや軽い朝食を取りましょう。",
    tour_3_title:"陶芸工房を巡る", tour_3_desc:"メインストリートを歩いて工房に入りましょう。職人がろくろで作業する様子を見られます。",
    tour_4_title:"陶芸品の購入", tour_4_desc:"職人から直接購入しましょう。壺、鍋、瓶、有名な陶器の貯金箱など。",
    tour_5_title:"伝統料理の昼食", tour_5_desc:"陶器で提供される牛肉のカスエラや巨大エンパナダをお楽しみください。",
    tour_6_title:"周辺の散策", tour_6_desc:"ロス・チニュエスへドライブ。田園風景と静けさが数分で楽しめます。",
    tour_7_title:"お土産を持って帰る", tour_7_desc:"最後にもう一度屋台を見て回りましょう。多くの職人が一日の終わりに割引を提供します。",
    s_gallery_title:"ポマイレのギャラリー", s_gallery_sub:"陶芸の村とその伝統の写真",
    gal_1:"陶器の陶芸", gal_2:"土鍋のカスエラ", gal_3:"ロス・チニュエス",
    gal_4:"メインストリート", gal_5:"作業中の職人", gal_6:"サン・アントニオ教会",
    gallery_note:"📷 ポマイレを訪れましたか？#Pomaire360 をつけて写真をシェアしてください",
    s_events_title:"イベントと重要な日付", s_events_sub:"ポマイレのお祭り、フェア、祝祭",
    ev_1_title:"夏の最盛期", ev_1_desc:"国内観光客の最盛期。早めの到着が重要です。",
    ev_2_title:"聖アントニオの祭り", ev_2_desc:"守護聖人の祝祭。行列、文化活動、特別な料理が広場で楽しめます。",
    ev_3_title:"独立記念日（フィエスタス・パトリアス）", ev_3_desc:"9月18日 — 伝統的な屋台、職人のチチャ、クエカダンス。",
    ev_4_title:"クリスマス工芸フェア", ev_4_desc:"季節限定の特別な作品：陶器のキリスト降誕シーン、装飾品、手作りのギフト。",
    ev_tag_busy:"需要が高い", ev_tag_fest:"守護聖人祭", ev_tag_nat:"独立記念日", ev_tag_xmas:"クリスマス",
    s_reviews_title:"訪問者の声", s_reviews_sub:"すでにポマイレを訪れた人々の体験談",
    rev_1_text:"\"魔法のような場所です。職人たちは信じられないほど才能があり、陶器で食べる料理は忘れられません。\"",
    rev_1_name:"María G.", rev_1_origin:" · サンティアゴ",
    rev_2_text:"\"We came from Brazil and were amazed by the pottery tradition. The giant empanadas were delicious!\"",
    rev_2_name:"Carlos M.", rev_2_origin:" · ブラジル",
    rev_3_text:"\"子供たちと一緒に来て完璧でした。陶器が作られる様子を見て子供たちは魅了されていました。\"",
    rev_3_name:"Valentina R.", rev_3_origin:" · バルパライソ",
    rev_4_text:"\"美丽的陶艺村！陶艺师傅非常友好，食物也很美味。强烈推荐！\"",
    rev_4_name:"Wei L.", rev_4_origin:" · 中国",
    review_form_title:"もうポマイレを訪れましたか？教えてください！",
    rev_ph_name:"お名前", rev_ph_origin:"お住まいの都市/国", rev_ph_text:"体験を共有してください...",
    review_btn:"⭐ レビューを投稿",
    rev_local_note:"📝 レビューはこのブラウザにのみ保存されます（まだ公開共有されません）。",
    filter_all:"すべて", filter_parking:"駐車場", filter_health:"医療", filter_security:"安全",
    filter_pottery:"陶芸", filter_food:"グルメ", filter_services:"サービス", filter_around:"周辺",
    locate_btn:"現在地を使用", map_hint:"📍 位置情報を有効にするか、地図上の出発点をクリックして距離を計算してください",
    official_map_btn:"ポマイレの公式イラストマップを見る", official_map_note:"職人工房の番号付きディレクトリ付き公式観光マップ。", official_map_dl:"マップをダウンロード",
    routes_title:"🧭 おすすめルート",
    route_artisan_name:"職人ルート", route_artisan_meta:"3か所 · 約1.5時間",
    route_family_name:"ファミリールート", route_family_meta:"4か所 · 約2.5時間",
    route_food_name:"グルメルート", route_food_meta:"3か所 · 約1時間",
    route_nature_name:"自然ルート", route_nature_meta:"3か所 · 約3時間",
    route_clear:"ルートを消去"
  },
  zh: {
    nav_park:"停车场", nav_health:"医疗", nav_security:"安全", nav_commerce:"商店",
    nav_pottery:"陶艺", nav_food:"美食", nav_around:"周边", nav_plaza:"广场",
    nav_map:"地图", nav_donate:"支持",
    hero_tag:"📍 波马伊雷 · 梅利皮利亚 · 首都大区",
    hero_h1:"欢迎来到<em>波马伊雷</em>",
    hero_sub:"无论您是游客还是刚搬来的新居民，这里提供您在智利最著名陶艺村所需的一切信息：服务、紧急联系、停车场等。",
    cta_plan:"规划您的行程", cta_directions:"如何前往", cta_eat:"美食推荐",
    wa_text:"分享", wa_aria:"通过 WhatsApp 分享 Pomaire 360",
    wa_share:"探索智利最著名的陶艺村波迈雷！🏺 服务、美食与旅游完整指南：https://pomaire360.cl/",
    emer_police:"🚔 133 警察", emer_samu:"🚑 131 救护车", emer_fire:"🚒 132 消防", emer_peace:"🕊️ 149 市民热线",
    s_park_title:"停车场", s_park_sub:"每个周末都有数千名游客到访 — 请提前规划停车位置",
    s_health_title:"医疗与紧急服务", s_health_sub:"波马伊雷及周边地区的诊所、医院和救护车",
    s_sec_title:"安全与紧急服务", s_sec_sub:"警察、消防和支援热线",
    s_com_title:"商店与日常服务", s_com_sub:"在波马伊雷生活或游览所需的基本信息",
    s_pot_title:"陶艺 — 波马伊雷的灵魂", s_pot_sub:"工坊、购物与定义这个村庄的传统工艺",
    s_gas_title:"传统美食", s_gas_sub:"用陶器盛放的传统风味",
    s_aro_title:"波马伊雷周边", s_aro_sub:"洛斯奇尼乌埃斯和值得探索的附近地区",
    s_pla_title:"广场与公共空间", s_pla_sub:"波马伊雷中心的集会与休憩场所",
    s_map_title:"波马伊雷地图", s_map_sub:"村庄位置与周边环境",
    s_don_title:"支持本项目", s_don_sub:"免费指南，以对波马伊雷的热爱维护",
    donate_text:"Pomaire 360 是一个独立的无广告项目。如果本指南对您有帮助，自愿捐款将有助于保持信息更新。谢谢！",
    donate_btn:"🏺 进行自愿捐款",
    donate_note:"通过 Mercado Pago 安全支付 · 信用卡、银行转账或数字钱包",
    emer_numbers:"紧急电话",
    footer_tagline:"游客与新居民指南",
    footer_emer:"紧急联系：",
    footer_disc:"信息仅供参考，请直接向各机构核实时间及详情。",
    footer_date:"最后更新：2026年6月 · 波马伊雷，梅利皮利亚，首都大区",
    nav_weather:"天气", nav_tour:"行程", nav_gallery:"画廊", nav_events:"活动", nav_reviews:"评价", nav_advertise:"刊登广告",
    s_weather_title:"波马伊雷实时天气", s_weather_sub:"实时状况，助您规划行程",
    weather_note:"实时数据 · Open-Meteo · 波马伊雷坐标",
    s_tour_title:"逐步旅游路线", s_tour_sub:"充分享受波马伊雷一天的完美行程",
    tour_1_title:"抵达与停车", tour_1_desc:"建议10点前到达，在拉斐尔·莫兰德街找到停车位。",
    tour_2_title:"广场早餐", tour_2_desc:"在中央广场的咖啡馆享用咖啡或简餐。",
    tour_3_title:"参观陶艺工坊", tour_3_desc:"沿主街漫步，进入工坊。观看工匠用陶轮制作陶器。",
    tour_4_title:"购买手工艺品", tour_4_desc:"直接向工匠购买。陶罐、陶碗、陶罐和著名的陶瓷储钱罐。",
    tour_5_title:"传统午餐", tour_5_desc:"享用陶罐盛装的牛肉炖菜或巨型恩潘纳达——波马伊雷最具代表性的菜肴！",
    tour_6_title:"周边漫游", tour_6_desc:"驱车前往洛斯奇尼乌埃斯，享受乡村风光与宁静，仅需几分钟。",
    tour_7_title:"带着纪念品返程", tour_7_desc:"最后一次逛逛摊位。许多工匠在一天结束时会提供折扣。",
    s_gallery_title:"波马伊雷画廊", s_gallery_sub:"陶艺村及其传统的图像",
    gal_1:"陶土工艺", gal_2:"陶罐炖菜", gal_3:"洛斯奇尼乌埃斯",
    gal_4:"主街", gal_5:"工匠工作中", gal_6:"圣安东尼奥教堂",
    gallery_note:"📷 去过波马伊雷？分享您的照片并标记 #Pomaire360",
    s_events_title:"活动与重要日期", s_events_sub:"波马伊雷的节日、集市与庆典",
    ev_1_title:"夏季旺季", ev_1_desc:"国内游客高峰期。建议早点到达。工匠备货更充足、款式更多。",
    ev_2_title:"圣安东尼奥节", ev_2_desc:"守护神节日，包括游行、文化活动和广场上的特色美食。",
    ev_3_title:"国庆节（Fiestas Patrias）", ev_3_desc:"9月18日 — 传统小摊、手工奇恰酒、传统库埃卡舞。",
    ev_4_title:"圣诞手工艺集市", ev_4_desc:"特别的季节性作品：陶土圣诞场景、装饰品和独特的手工礼物。",
    ev_tag_busy:"高需求", ev_tag_fest:"守护神节", ev_tag_nat:"国庆节", ev_tag_xmas:"圣诞节",
    s_reviews_title:"游客评价", s_reviews_sub:"已经到访波马伊雷的人们的体验",
    rev_1_text:"\"一个神奇的地方。工匠们才华横溢，用陶罐盛装的食物令人难忘。\"",
    rev_1_name:"María G.", rev_1_origin:" · 圣地亚哥",
    rev_2_text:"\"We came from Brazil and were amazed by the pottery tradition. The giant empanadas were delicious!\"",
    rev_2_name:"Carlos M.", rev_2_origin:" · 巴西",
    rev_3_text:"\"我们带着孩子来，非常完美。看到陶器现场制作让他们着迷。\"",
    rev_3_name:"Valentina R.", rev_3_origin:" · 瓦尔帕莱索",
    rev_4_text:"\"美丽的陶艺村！陶艺师傅非常友好，食物也很美味。强烈推荐！\"",
    rev_4_name:"Wei L.", rev_4_origin:" · 中国",
    review_form_title:"已经去过波马伊雷？告诉我们吧！",
    rev_ph_name:"您的姓名", rev_ph_origin:"您的城市/国家", rev_ph_text:"分享您的体验...",
    review_btn:"⭐ 发布评价",
    rev_local_note:"📝 您的评价仅保存在此浏览器中（暂不公开共享）。",
    filter_all:"全部", filter_parking:"停车场", filter_health:"医疗", filter_security:"安全",
    filter_pottery:"陶艺", filter_food:"美食", filter_services:"服务", filter_around:"周边",
    locate_btn:"使用我的位置", map_hint:"📍 启用您的位置或点击地图上的起点以计算距离",
    official_map_btn:"查看波马伊雷官方手绘地图", official_map_note:"官方旅游地图，附有工匠工坊的编号目录。", official_map_dl:"下载地图",
    routes_title:"🧭 推荐路线",
    route_artisan_name:"工匠路线", route_artisan_meta:"3个站点 · 约1.5小时",
    route_family_name:"家庭路线", route_family_meta:"4个站点 · 约2.5小时",
    route_food_name:"美食路线", route_food_meta:"3个站点 · 约1小时",
    route_nature_name:"自然路线", route_nature_meta:"3个站点 · 约3小时",
    route_clear:"清除路线"
  }
};

let currentLang = 'es';

/* ══ TRADUCCIONES ADICIONALES (contenido que faltaba traducir) ══ */
const LANG_EXTRA = {
  es: {
    nav_lodging:"Alojamientos", nav_seewhat:"Qué ver",
    nav_g_essentials:"Esenciales", nav_g_todo:"Qué hacer", nav_g_eatsleep:"Comer y dormir", nav_g_plan:"Planifica", nav_winery:"Ruta del Vino", site_municipality:"Municipalidad", site_official_map:"Ver mapa oficial de Pomaire",
    ev_m1:"ENE–FEB", ev_m2:"JUN", ev_m3:"SEP", ev_m4:"NOV–DIC", weather_loading:"⏳ Cargando clima...", social_title:"Síguenos en redes", social_sub:"Fotos, novedades y la vida del pueblo alfarero, todos los días.", social_ig:"Síguenos en Instagram",
    a11y_title:"♿ Accesibilidad", a11y_font:"🔠 Tamaño de letra", a11y_read:"🔊 Lectura en voz alta", a11y_readall:"📖 Leer todo", a11y_hint:"Activa la lectura y luego toca cualquier texto del sitio para escucharlo en voz alta.", a11y_hint_active:"✅ Lectura activa: toca cualquier texto del sitio para escucharlo.", a11y_activate:"🔊 Activar", a11y_stop:"⏹ Detener", a11y_unavailable:"🔇 No disponible", a11y_size_normal:"Tamaño normal", a11y_size:"Tamaño", a11y_voice_on:"Lectura en voz alta activada. Toca cualquier texto para escucharlo.", a11y_no_support:"Tu navegador no soporta la lectura en voz alta.", a11y_aria_options:"Opciones de accesibilidad", a11y_aria_close:"Cerrar",
    s_lodging_title:"Alojamientos", s_lodging_sub:"Hostales, cabañas y suites para quedarte en Pomaire · <em>Where to stay</em>",
    s_interes_title:"Qué ver y puntos de interés", s_interes_sub:"Atractivos, tiendas con encanto y experiencias al paso · <em>Highlights &amp; things to see</em>",
    lnk_map:"📍 Ver en mapa", lnk_zone:"📍 Ver zona", lnk_howto:"📍 Cómo llegar",
    pk1_badge:"Principal · Entrada norte", pk1_title:"Estacionamiento Entrada Pomaire", pk1_detail:"Calle Rafael Morandé, frente al acceso principal. El más grande del pueblo. Fin de semana puede llenarse antes de las 11:00.",
    pk2_badge:"Lateral · Calle artesanos", pk2_title:"Estacionamiento Calle 18 de Septiembre", pk2_detail:"Banquinas en calle 18 de Septiembre, lateral al casco principal. Opción si la entrada norte está llena.",
    pk3_badge:"Buses y minibuses", pk3_title:"Zona de buses turísticos", pk3_detail:"Sector habilitado para buses y furgones de turismo. Pregunta al guardia en la entrada norte.",
    pk4_badge:"Consejo", pk4_title:"Tips para estacionar", pk4_detail:"Llegando antes de las 10:30 en fines de semana evitas la saturación. No bloquees salidas de vecinos ni caminos rurales.",
    he1_badge:"CESFAM · Pomaire", he1_detail:"Artesana Julita Vera 354, Pomaire",
    he2_badge:"Hospital · Melipilla", he2_detail:"O'Higgins 551, Melipilla · Urgencias 24 hrs. Referencia principal para casos graves desde Pomaire (≈15 min en auto).",
    he3_badge:"Emergencia · 24 hrs", he3_title:"SAMU Ambulancia — emergencias", he3_detail:"Llamada gratuita desde cualquier teléfono, las 24 horas. Para accidentes, infarto, urgencias vitales.", he3_link:"📞 Llamar 131",
    he4_badge:"Farmacia · Melipilla", he4_title:"Farmacias en Melipilla", he4_detail:"En Pomaire existe una farmacia. Dirección San Antonio 140. Farmacias de Turno diario rotativo.", he4_link:"🔗 Ver turno hoy",
    emn_police:"Carabineros", emn_samu:"SAMU Ambulancia", emn_fire:"Bomberos", emn_peace:"Paz ciudadana", emn_vif:"VIF · Mujer", emn_power:"Corte luz CGE",
    se1_badge:"Carabineros · Pomaire", se1_title:"Tenencia Pomaire", se1_detail:"Calle San Rafael 496. Atención local de Policia Carabineros.", se_emer133:"📞 Emergencias 133", se1_link2:"📞 Emergencias Plan Cuadrante +56984289058",
    se2_badge:"Bomberos · Melipilla", se2_title:"Central de Bomberos Melipilla", se2_detail:"Responden para Pomaire y localidades rurales. Ante incendio o rescate llama al 132.", se_emer132:"📞 Emergencias 132",
    se3_badge:"Servicio eléctrico", se3_title:"CGE — Corte de luz", se3_detail:"Para reportar averías eléctricas domiciliarias. Disponible las 24 horas.",
    co1_badge:"Almacén · Centro", co1_title:"Almacenes en calle principal", co1_detail:"Varios almacenes y minimarkets en Rafael Morandé y alrededores. Venden agua, snacks, artículos básicos para el visitante.",
    co2_badge:"Mecánico · Ruta", co2_title:"Mecánico / Taller automotriz", co2_detail:"Hay pequeños talleres en la ruta de acceso y en el camino hacia Melipilla. Para averías graves lo más cercano está en Melipilla ciudad.", co2_link:"📍 Buscar talleres",
    co3_badge:"Combustible", co3_title:"Bencinerías", co3_detail:"La bencinería más cercana está en la ruta hacia Melipilla. Se recomienda llegar con el estanque lleno si vienes de Santiago.",
    co4_badge:"Cajero · Efectivo", co4_title:"Cajeros automáticos", co4_detail:"hay un cajero automático dentro del pueblo Calle Roberto Bravo 445. Muchos locales aceptan tarjeta.",
    co5_badge:"Correos / Encomiendas", co5_title:"Correos Chile", co5_detail:"La oficina de Correos más cercana está en Melipilla ciudad. Coordina despachos desde allí.",
    co6_badge:"Información turística", co6_title:"Punto de información local", co6_detail:"En la entrada principal hay señalética turística. Los artesanos y locatarios suelen orientar bien a los visitantes.", co6_detail2:"En la plaza de Pomaire existe un punto de información turistica.",
    pl1_badge:"Plaza · Centro", pl1_title:"Plaza de Pomaire", pl1_detail:"La plaza central es el corazón del pueblo. Rodeada de locales de artesanía y gastronomía. Ideal para descansar y orientarse.",
    pl2_badge:"Iglesia", pl2_detail:"Iglesia histórica del pueblo. Referente arquitectónico.",
    pl3_badge:"Salón del Reino", pl3_detail:"Espacio Público Espiritual. Horarios: Jueves 19:00 - 21:15 hrs.     Sábado 19:00-20:45 Hrs..",
    pl4_badge:"Servicios", pl4_title:"Baños públicos", pl4_detail:"Hay baños disponibles cerca de la plaza central y en algunos locales gastronómicos. En temporada alta puede haber cola.",
    al1_badge:"Artesanía · Calle principal", al1_title:"Calle de los alfareros", al1_detail:"Rafael Morandé es la calle principal, repleta de talleres y tiendas donde artesanos trabajan y venden en vivo. Piezas en greda: jarras, cazuelas, tinajas y más.",
    al2_badge:"Taller abierto", al2_title:"Ver alfareros trabajando", al2_detail:"Muchos artesanos trabajan con sus tornos y hornos a la vista. Se puede ver el proceso completo: desde la greda cruda hasta la pieza terminada.",
    al3_badge:"Consejos de compra", al3_title:"Comprar artesanía responsable", al3_detail:"Prefiere comprar directamente al artesano. Evita regatear agresivamente — cada pieza tiene trabajo y tradición familiar detrás.",
    al4_badge:"Patrimonio", al4_title:"Patrimonio inmaterial de Chile", al4_detail:"La alfarería de Pomaire es reconocida como patrimonio cultural. Técnicas transmitidas de generación en generación por siglos.",
    al5_badge:"Chanco Alcancia", al5_title:"Chancho Alcancia de greda más grande del mundo", al5_detail:"Museo con figuras de greda gigantes",
    dir_taller_h:"🎨 Talleres de greda", dir_taller_sub:"Aprende a modelar la greda con artesanos pomairinos · <em>Pottery workshops</em>",
    dir_demo_h:"🌀 Demostraciones en torno", dir_demo_sub:"Mira a los maestros dar forma a la greda en vivo · <em>Pottery wheel demonstrations</em>",
    dir_arte_h:"🏺 Tiendas y artesanos de greda", dir_arte_sub:"Compra directamente al artesano. Listado completo de alfareros de Pomaire · <em>Pottery shops &amp; artisans</em>",
    ga1_badge:"Plato estrella", ga1_title:"Cazuela de barro", ga1_detail:"El plato más icónico de Pomaire. Cazuelas, empanadas y pastel de choclo servidos en recipientes de greda fabricados en el propio pueblo.",
    ga2_badge:"Clásico", ga2_title:"Empanadas gigantes", ga2_detail:"Pomaire es famoso por sus empanadas de gran tamaño. Hay locales de empanadas a lo largo de toda la calle principal.",
    ga3_badge:"Bebidas", ga3_title:"Chicha y bebidas tradicionales", ga3_detail:"Chicha de manzana y uva, mote con huesillo y bebidas artesanales. Perfectos para acompañar la gastronomía local.",
    ga4_badge:"Dónde comer", ga4_title:"Restaurantes y fondas", ga4_detail:"Numerosos restaurantes en la calle principal y sus laterales. Los fines de semana pueden tener espera. Se recomienda llegar antes del mediodía.", ga4_link:"📋 Ver directorio", ga4_map:"🗺️ Ver en el mapa",
    dir_rest_h:"🍴 Directorio de restaurantes", dir_rest_sub:"Restaurantes de Pomaire con dirección, teléfono y días de atención · <em>Restaurants directory</em>",
    lodging_note:"💡 Quedarte a dormir te permite disfrutar Pomaire sin la multitud de los buses de turismo y vivir el pueblo de noche.",
    dir_jardin_h:"🌱 Jardinería y viveros", dir_jardin_sub:"Plantas, flores y un respiro verde · <em>Gardening &amp; plants</em>",
    dir_serv_h:"📌 Puntos clave y servicios", dir_serv_sub:"Ubicaciones útiles durante tu visita · <em>Key points &amp; services</em>",
    ar1_badge:"Sector rural · Cercano", ar1_detail:"Localidad rural muy cercana a Pomaire. Paisaje de secano costero con viñedos y quebradas. Ideal para quienes buscan tranquilidad y naturaleza fuera del casco turístico.",
    ar2_badge:"Rutas rurales", ar2_title:"Caminos y vinos del secano", ar2_detail:"El entorno de Pomaire es zona vitivinícola tradicional. Pequeños productores familiares de chicha y vino en el sector de Los Chiñihues y caminos aledaños.",
    ar3_badge:"Naturaleza", ar3_title:"Cerros y quebradas", ar3_detail:"Los cerros que rodean Pomaire ofrecen vistas al valle de Melipilla. Hay senderos informales accesibles desde la ruta que une el pueblo con Los Chiñihues.",
    ar4_badge:"Acceso", ar4_title:"Cómo llegar desde Santiago", ar4_detail:"Autopista del Sol (Ruta 78) hacia Melipilla. Salida en el km 51 con señalética a Pomaire. Aproximadamente 50 min desde Santiago en auto.",
    ar5_badge:"Transporte público", ar5_title:"Buses desde Santiago/Melipilla", ar5_detail:"Hay buses desde el Terminal San Borja (Santiago) con parada en Melipilla. Desde Melipilla salen micros rurales hacia Pomaire regularmente.", ar5_link:"📍 Terminal Melipilla",
    ar6_badge:"Conectividad", ar6_title:"Señal móvil y WiFi", ar6_detail:"La señal celular en Pomaire es razonable en el centro, pero puede ser débil en Los Chiñihues y sectores rurales. Algunos restaurantes ofrecen WiFi.",
    wine_title:"Ruta del Vino y la Chicha", wine_sub:"El secano costero de Pomaire y Los Chiñihues, tierra de viñas tradicionales · <em>Wine &amp; chicha route</em>",
    wine_tag:"🍇 Experiencia · Valle de Melipilla · Secano Costero",
    wine_intro:"Más allá de la greda, el entorno de Pomaire es <strong>tierra de viñas y parras tradicionales</strong>. En el secano costero y el sector de <strong>Los Chiñihues</strong> sobreviven pequeños productores familiares que elaboran <strong>chicha de manzana y uva</strong>, pipeño y vino campesino con técnicas heredadas por generaciones. Una ruta para descubrir el lado rural y festivo del pueblo alfarero.",
    wine_c1_t:"Cepa País", wine_c1_d:"La uva tradicional del secano chileno, base de los vinos campesinos y del pipeño. Una de las cepas más antiguas del país, cultivada en parronales rústicos de la zona.",
    wine_c2_t:"Chicha artesanal", wine_c2_d:"La bebida emblemática del lugar: chicha de manzana y de uva, fresca y dulce. Se encuentra en los restaurantes típicos y abunda especialmente en torno a las Fiestas Patrias.",
    wine_c3_t:"Pipeño del secano", wine_c3_d:"Vino joven y rústico, de carácter campesino, ideal para acompañar una cazuela o una empanada gigante. El maridaje perfecto de la cocina pomairina.",
    wine_c4_t:"Los Chiñihues", wine_c4_d:"Sector rural a pocos minutos de Pomaire, de viñedos, quebradas y caminos tranquilos. El corazón de la tradición vitivinícola familiar de los alrededores.",
    wine_c5_t:"Maridaje en greda", wine_c5_d:"La chicha y el vino se sirven en jarras y vasijas de greda hechas en el propio pueblo, uniendo en una sola experiencia las dos grandes tradiciones de Pomaire.",
    wine_c6_t:"Mejor temporada", wine_c6_d:"La vendimia (marzo–abril) y las Fiestas Patrias (septiembre) son las épocas con más chicha fresca, parras cargadas y ambiente festivo en el secano.",
    wine_steps_h:"🧭 Cómo recorrer la ruta",
    wine_s1_t:"Parte en el centro de Pomaire", wine_s1_d:"Prueba una chicha de manzana o uva en los restaurantes típicos de la calle Roberto Bravo y San Antonio.",
    wine_s2_t:"Sigue hacia Los Chiñihues", wine_s2_d:"Recorre en auto los caminos rurales del secano, entre parronales y quebradas. Lleva el estanque lleno: hay poca señal y pocos servicios.",
    wine_s3_t:"Busca a los productores familiares", wine_s3_d:"Pregunta en el pueblo por chicha y vino artesanal de temporada; muchos se venden directamente en casas y puestos del sector.",
    wine_s4_t:"Cierra con gastronomía", wine_s4_d:"Vuelve al pueblo y marida tu hallazgo con una cazuela o empanada servida en greda. ¡Salud!",
    wine_cta_t:"🍷 ¿Tienes una viña, parronal o produces chicha en la zona? Suma tu lugar a esta ruta y aparece en la guía.", wine_cta_btn:"🗺️ Ver Los Chiñihues",
    wine_note:"Ruta basada en la tradición vitivinícola del secano costero de Melipilla. Los productores y horarios varían según la temporada; consulta en el pueblo. Bebe con moderación · solo mayores de 18 años.",
    or_title:"Ruta Turística Oficial de Pomaire", or_src:"Itinerario sugerido por la Oficina de Turismo · Municipalidad de Melipilla · <em>Official tourist route</em>",
    or_badge1:"🚶 Recorrido a pie: ~35 min", or_badge2:"🚗 Recorrido en auto: ~19 min", or_badge3:"📅 Día completo desde Santiago",
    or_st1_t:"Salida desde Santiago", or_st1_d:"Inicio del viaje hacia el pueblo alfarero.",
    or_st2_t:"Llegada a Pomaire", or_st2_d:"Recibimiento en la Oficina de Información Turística (OIT), en la Plaza de Pomaire.",
    or_st3_t:"Desayuno en Imperio Pomaire", or_st3_d:"Roberto Bravo 78 · Sabores típicos chilenos para comenzar el día.",
    or_st4_t:"Taller de greda en la Granja Alfarera", or_st4_d:"Bernardo O'Higgins 260 · Experiencia inmersiva: del torno al horno.",
    or_st5_t:"Almuerzo en Restaurant La Greda", or_st5_d:"Cocina criolla y parrilla chilena con más de 30 años de historia.",
    or_st6_t:"Visita al Vivero Luchín", or_st6_d:"San Antonio 191 · Un respiro verde entre plantas, flores y maceteros.",
    or_st7_t:"Tarde libre de compras", or_st7_d:"Recorre los talleres y tiendas de greda de la calle Roberto Bravo.",
    or_st8_t:"Retorno a Santiago", or_st8_d:"Fin del recorrido con recuerdos hechos a mano.",
    or_f1:"Nacido del esfuerzo de Romina y Fabio por la cocina tradicional. Tras siete años abrieron un segundo local y hoy es un referente de los sabores típicos de Pomaire.",
    or_f2:"Espacio turístico-cultural dedicado a preservar el oficio de la greda. Ofrece demostraciones en vivo, talleres con artesanos pomairinos y un recorrido por todo el proceso, desde la extracción hasta el horno.",
    or_f3:"Más de 30 años de tradición. Don Víctor Larraín transformó la antigua casona de adobe familiar en un referente gastronómico, cuna de la empanada más grande del mundo y de tres generaciones de cocina criolla.",
    or_f4:"Pequeño y encantador vivero que combina lo rural, lo botánico y lo artesanal. Ideal para una pausa tranquila tras recorrer talleres y restaurantes, y para llevarse un recuerdo vivo de Pomaire.",
    free_tour_label:"💡 Recorrido libre · explora a tu ritmo",
    filter_lodging:"Dormir", filter_highlight:"Qué ver", route_oficial_name:"Ruta Oficial", route_oficial_meta:"5 paradas · día completo"
  },
  en: {
    nav_lodging:"Lodging", nav_seewhat:"What to see",
    nav_g_essentials:"Essentials", nav_g_todo:"What to do", nav_g_eatsleep:"Eat & sleep", nav_g_plan:"Plan", nav_winery:"Wine Route", site_municipality:"Municipality", site_official_map:"View official Pomaire map",
    ev_m1:"JAN–FEB", ev_m2:"JUN", ev_m3:"SEP", ev_m4:"NOV–DEC", weather_loading:"⏳ Loading weather...", social_title:"Follow us on social media", social_sub:"Photos, news and the life of the pottery village, every day.", social_ig:"Follow us on Instagram",
    a11y_title:"♿ Accessibility", a11y_font:"🔠 Font size", a11y_read:"🔊 Read aloud", a11y_readall:"📖 Read all", a11y_hint:"Turn on reading and then tap any text on the site to hear it read aloud.", a11y_hint_active:"✅ Reading active: tap any text on the site to hear it.", a11y_activate:"🔊 Turn on", a11y_stop:"⏹ Stop", a11y_unavailable:"🔇 Unavailable", a11y_size_normal:"Normal size", a11y_size:"Size", a11y_voice_on:"Read aloud turned on. Tap any text to hear it.", a11y_no_support:"Your browser does not support read aloud.", a11y_aria_options:"Accessibility options", a11y_aria_close:"Close",
    s_lodging_title:"Lodging", s_lodging_sub:"Hostels, cabins and suites to stay overnight in Pomaire · <em>Where to stay</em>",
    s_interes_title:"What to see & points of interest", s_interes_sub:"Attractions, charming shops and quick experiences · <em>Highlights &amp; things to see</em>",
    lnk_map:"📍 View on map", lnk_zone:"📍 View area", lnk_howto:"📍 How to get there",
    pk1_badge:"Main · North entrance", pk1_title:"Pomaire Entrance Parking", pk1_detail:"Rafael Morandé street, in front of the main access. The largest in town. On weekends it can fill up before 11:00.",
    pk2_badge:"Side · Artisans street", pk2_title:"18 de Septiembre Street Parking", pk2_detail:"Roadside spaces on 18 de Septiembre street, next to the town center. An option if the north entrance is full.",
    pk3_badge:"Buses and minibuses", pk3_title:"Tourist bus zone", pk3_detail:"Area set aside for tour buses and vans. Ask the guard at the north entrance.",
    pk4_badge:"Tip", pk4_title:"Parking tips", pk4_detail:"Arriving before 10:30 on weekends helps you avoid the crowds. Don't block neighbors' driveways or rural roads.",
    he1_badge:"CESFAM · Pomaire", he1_detail:"Artesana Julita Vera 354, Pomaire",
    he2_badge:"Hospital · Melipilla", he2_detail:"O'Higgins 551, Melipilla · 24-hr emergency room. Main reference for serious cases from Pomaire (≈15 min by car).",
    he3_badge:"Emergency · 24 hrs", he3_title:"SAMU Ambulance — emergencies", he3_detail:"Free call from any phone, 24 hours a day. For accidents, heart attacks and life-threatening emergencies.", he3_link:"📞 Call 131",
    he4_badge:"Pharmacy · Melipilla", he4_title:"Pharmacies in Melipilla", he4_detail:"There is one pharmacy in Pomaire, at San Antonio 140. On-duty pharmacies rotate daily.", he4_link:"🔗 See today's on-duty",
    emn_police:"Police (Carabineros)", emn_samu:"SAMU Ambulance", emn_fire:"Fire brigade", emn_peace:"Public safety", emn_vif:"Domestic violence · Women", emn_power:"CGE power outage",
    se1_badge:"Police · Pomaire", se1_title:"Pomaire Police Station", se1_detail:"San Rafael 496 street. Local Carabineros police service.", se_emer133:"📞 Emergencies 133", se1_link2:"📞 Quadrant Plan emergencies +56984289058",
    se2_badge:"Fire brigade · Melipilla", se2_title:"Melipilla Fire Station", se2_detail:"They respond to Pomaire and rural areas. In case of fire or rescue call 132.", se_emer132:"📞 Emergencies 132",
    se3_badge:"Electrical service", se3_title:"CGE — Power outage", se3_detail:"To report household electrical faults. Available 24 hours.",
    co1_badge:"Grocery · Center", co1_title:"Shops on the main street", co1_detail:"Several grocery shops and minimarkets on and around Rafael Morandé. They sell water, snacks and basics for visitors.",
    co2_badge:"Mechanic · Road", co2_title:"Mechanic / car workshop", co2_detail:"There are small workshops along the access road and on the way to Melipilla. For serious breakdowns the nearest help is in Melipilla city.", co2_link:"📍 Find workshops",
    co3_badge:"Fuel", co3_title:"Gas stations", co3_detail:"The nearest gas station is on the road to Melipilla. We recommend arriving with a full tank if you come from Santiago.",
    co4_badge:"ATM · Cash", co4_title:"ATMs", co4_detail:"There is an ATM inside the town at Roberto Bravo 445 street. Many shops accept cards.",
    co5_badge:"Post / Parcels", co5_title:"Correos Chile", co5_detail:"The nearest post office is in Melipilla city. Arrange shipments from there.",
    co6_badge:"Tourist information", co6_title:"Local information point", co6_detail:"There is tourist signage at the main entrance. Artisans and shopkeepers usually guide visitors well.", co6_detail2:"There is a tourist information point in Pomaire's main square.",
    pl1_badge:"Square · Center", pl1_title:"Pomaire Main Square", pl1_detail:"The central square is the heart of the town. Surrounded by craft and food shops. Ideal to rest and get your bearings.",
    pl2_badge:"Church", pl2_detail:"Historic town church. An architectural landmark.",
    pl3_badge:"Kingdom Hall", pl3_detail:"Public spiritual space. Hours: Thursday 19:00 - 21:15. Saturday 19:00 - 20:45.",
    pl4_badge:"Services", pl4_title:"Public restrooms", pl4_detail:"There are restrooms near the central square and in some restaurants. During high season there may be a line.",
    al1_badge:"Crafts · Main street", al1_title:"Street of the potters", al1_detail:"Rafael Morandé is the main street, full of workshops and shops where artisans work and sell live. Clay pieces: jugs, pots, jars and more.",
    al2_badge:"Open workshop", al2_title:"Watch potters at work", al2_detail:"Many artisans work with their wheels and kilns in plain view. You can see the whole process: from raw clay to the finished piece.",
    al3_badge:"Buying tips", al3_title:"Buy crafts responsibly", al3_detail:"Prefer buying directly from the artisan. Avoid haggling aggressively — each piece carries work and family tradition behind it.",
    al4_badge:"Heritage", al4_title:"Intangible heritage of Chile", al4_detail:"Pomaire's pottery is recognized as cultural heritage. Techniques handed down from generation to generation for centuries.",
    al5_badge:"Piggy bank", al5_title:"World's largest clay piggy bank", al5_detail:"Museum with giant clay figures",
    dir_taller_h:"🎨 Clay workshops", dir_taller_sub:"Learn to shape clay with Pomaire artisans · <em>Pottery workshops</em>",
    dir_demo_h:"🌀 Wheel demonstrations", dir_demo_sub:"Watch the masters shape clay live · <em>Pottery wheel demonstrations</em>",
    dir_arte_h:"🏺 Clay shops and artisans", dir_arte_sub:"Buy directly from the artisan. Complete listing of Pomaire potters · <em>Pottery shops &amp; artisans</em>",
    ga1_badge:"Signature dish", ga1_title:"Clay-pot cazuela", ga1_detail:"Pomaire's most iconic dish. Cazuelas, empanadas and pastel de choclo served in clay pots made in the town itself.",
    ga2_badge:"Classic", ga2_title:"Giant empanadas", ga2_detail:"Pomaire is famous for its huge empanadas. There are empanada shops all along the main street.",
    ga3_badge:"Drinks", ga3_title:"Chicha and traditional drinks", ga3_detail:"Apple and grape chicha, mote con huesillo and artisanal drinks. Perfect to accompany the local food.",
    ga4_badge:"Where to eat", ga4_title:"Restaurants and eateries", ga4_detail:"Numerous restaurants on the main street and its side streets. On weekends there may be a wait. We recommend arriving before noon.", ga4_link:"📋 View directory", ga4_map:"🗺️ View on map",
    dir_rest_h:"🍴 Restaurant directory", dir_rest_sub:"Pomaire restaurants with address, phone and opening days · <em>Restaurants directory</em>",
    lodging_note:"💡 Staying overnight lets you enjoy Pomaire without the tour-bus crowds and experience the town at night.",
    dir_jardin_h:"🌱 Gardening and nurseries", dir_jardin_sub:"Plants, flowers and a green break · <em>Gardening &amp; plants</em>",
    dir_serv_h:"📌 Key points and services", dir_serv_sub:"Useful locations during your visit · <em>Key points &amp; services</em>",
    ar1_badge:"Rural area · Nearby", ar1_detail:"A rural locality very close to Pomaire. Coastal dryland landscape with vineyards and ravines. Ideal for those seeking peace and nature away from the tourist center.",
    ar2_badge:"Rural routes", ar2_title:"Dryland roads and wines", ar2_detail:"The area around Pomaire is a traditional wine-growing zone. Small family producers of chicha and wine in Los Chiñihues and nearby roads.",
    ar3_badge:"Nature", ar3_title:"Hills and ravines", ar3_detail:"The hills surrounding Pomaire offer views over the Melipilla valley. There are informal trails accessible from the road linking the town with Los Chiñihues.",
    ar4_badge:"Access", ar4_title:"How to get there from Santiago", ar4_detail:"Autopista del Sol (Route 78) toward Melipilla. Exit at km 51 with signage to Pomaire. About 50 min from Santiago by car.",
    ar5_badge:"Public transport", ar5_title:"Buses from Santiago/Melipilla", ar5_detail:"There are buses from Terminal San Borja (Santiago) stopping in Melipilla. From Melipilla, rural minibuses run to Pomaire regularly.", ar5_link:"📍 Melipilla terminal",
    ar6_badge:"Connectivity", ar6_title:"Mobile signal and WiFi", ar6_detail:"Cell signal in Pomaire is reasonable downtown, but can be weak in Los Chiñihues and rural areas. Some restaurants offer WiFi.",
    wine_title:"Wine & Chicha Route", wine_sub:"The coastal dryland of Pomaire and Los Chiñihues, land of traditional vines · <em>Wine &amp; chicha route</em>",
    wine_tag:"🍇 Experience · Melipilla Valley · Coastal Dryland",
    wine_intro:"Beyond the clay, the area around Pomaire is <strong>a land of traditional vines and arbors</strong>. In the coastal dryland and the <strong>Los Chiñihues</strong> area, small family producers still make <strong>apple and grape chicha</strong>, pipeño and country wine using techniques passed down over generations. A route to discover the rural, festive side of the potters' town.",
    wine_c1_t:"País grape", wine_c1_d:"The traditional grape of the Chilean dryland, the base of country wines and pipeño. One of the oldest varieties in the country, grown on rustic arbors in the area.",
    wine_c2_t:"Artisanal chicha", wine_c2_d:"The emblematic drink of the place: apple and grape chicha, fresh and sweet. Found in the typical restaurants and especially abundant around the National Holidays.",
    wine_c3_t:"Dryland pipeño", wine_c3_d:"A young, rustic country wine, ideal to accompany a cazuela or a giant empanada. The perfect pairing for Pomaire cuisine.",
    wine_c4_t:"Los Chiñihues", wine_c4_d:"A rural area a few minutes from Pomaire, with vineyards, ravines and quiet roads. The heart of the family wine-growing tradition of the surroundings.",
    wine_c5_t:"Pairing in clay", wine_c5_d:"Chicha and wine are served in clay jugs and vessels made in the town itself, uniting Pomaire's two great traditions in a single experience.",
    wine_c6_t:"Best season", wine_c6_d:"The harvest (March–April) and the National Holidays (September) are the times with the most fresh chicha, loaded vines and festive atmosphere in the dryland.",
    wine_steps_h:"🧭 How to follow the route",
    wine_s1_t:"Start in downtown Pomaire", wine_s1_d:"Try an apple or grape chicha in the typical restaurants on Roberto Bravo and San Antonio streets.",
    wine_s2_t:"Head toward Los Chiñihues", wine_s2_d:"Drive the rural dryland roads, among arbors and ravines. Bring a full tank: there is little signal and few services.",
    wine_s3_t:"Look for family producers", wine_s3_d:"Ask in town for seasonal chicha and artisanal wine; many are sold directly at homes and stands in the area.",
    wine_s4_t:"Finish with gastronomy", wine_s4_d:"Return to town and pair your find with a cazuela or empanada served in clay. Cheers!",
    wine_cta_t:"🍷 Do you have a vineyard or arbor, or make chicha in the area? Add your place to this route and appear in the guide.", wine_cta_btn:"🗺️ View Los Chiñihues",
    wine_note:"Route based on the wine-growing tradition of the Melipilla coastal dryland. Producers and hours vary by season; ask in town. Drink responsibly · adults 18+ only.",
    or_title:"Official Tourist Route of Pomaire", or_src:"Itinerary suggested by the Tourism Office · Municipality of Melipilla · <em>Official tourist route</em>",
    or_badge1:"🚶 On foot: ~35 min", or_badge2:"🚗 By car: ~19 min", or_badge3:"📅 Full day from Santiago",
    or_st1_t:"Departure from Santiago", or_st1_d:"Start of the trip toward the potters' town.",
    or_st2_t:"Arrival in Pomaire", or_st2_d:"Welcome at the Tourist Information Office (OIT), in Pomaire's main square.",
    or_st3_t:"Breakfast at Imperio Pomaire", or_st3_d:"Roberto Bravo 78 · Typical Chilean flavors to start the day.",
    or_st4_t:"Clay workshop at Granja Alfarera", or_st4_d:"Bernardo O'Higgins 260 · An immersive experience: from the wheel to the kiln.",
    or_st5_t:"Lunch at Restaurant La Greda", or_st5_d:"Chilean home cooking and grill with more than 30 years of history.",
    or_st6_t:"Visit to Vivero Luchín", or_st6_d:"San Antonio 191 · A green break among plants, flowers and planters.",
    or_st7_t:"Free afternoon for shopping", or_st7_d:"Browse the clay workshops and shops on Roberto Bravo street.",
    or_st8_t:"Return to Santiago", or_st8_d:"End of the tour with handmade souvenirs.",
    or_f1:"Born from Romina and Fabio's dedication to traditional cooking. After seven years they opened a second venue and today it is a reference for Pomaire's typical flavors.",
    or_f2:"A tourist-cultural space dedicated to preserving the craft of clay. It offers live demonstrations, workshops with Pomaire artisans and a tour of the whole process, from extraction to the kiln.",
    or_f3:"More than 30 years of tradition. Don Víctor Larraín turned the old family adobe house into a gastronomic landmark, birthplace of the world's largest empanada and of three generations of home cooking.",
    or_f4:"A small, charming nursery that combines the rural, the botanical and the artisanal. Ideal for a quiet pause after touring workshops and restaurants, and to take home a living memory of Pomaire.",
    free_tour_label:"💡 Free tour · explore at your own pace",
    filter_lodging:"Stay", filter_highlight:"See", route_oficial_name:"Official Route", route_oficial_meta:"5 stops · full day"
  },
  pt: {
    nav_lodging:"Hospedagem", nav_seewhat:"O que ver",
    nav_g_essentials:"Essenciais", nav_g_todo:"O que fazer", nav_g_eatsleep:"Comer e dormir", nav_g_plan:"Planeje", nav_winery:"Rota do Vinho", site_municipality:"Prefeitura", site_official_map:"Ver mapa oficial de Pomaire",
    ev_m1:"JAN–FEV", ev_m2:"JUN", ev_m3:"SET", ev_m4:"NOV–DEZ", weather_loading:"⏳ Carregando clima...", social_title:"Siga-nos nas redes", social_sub:"Fotos, novidades e a vida do povoado dos oleiros, todos os dias.", social_ig:"Siga-nos no Instagram",
    a11y_title:"♿ Acessibilidade", a11y_font:"🔠 Tamanho da fonte", a11y_read:"🔊 Leitura em voz alta", a11y_readall:"📖 Ler tudo", a11y_hint:"Ative a leitura e depois toque em qualquer texto do site para ouvi-lo em voz alta.", a11y_hint_active:"✅ Leitura ativa: toque em qualquer texto do site para ouvi-lo.", a11y_activate:"🔊 Ativar", a11y_stop:"⏹ Parar", a11y_unavailable:"🔇 Indisponível", a11y_size_normal:"Tamanho normal", a11y_size:"Tamanho", a11y_voice_on:"Leitura em voz alta ativada. Toque em qualquer texto para ouvi-lo.", a11y_no_support:"Seu navegador não suporta a leitura em voz alta.", a11y_aria_options:"Opções de acessibilidade", a11y_aria_close:"Fechar",
    s_lodging_title:"Hospedagem", s_lodging_sub:"Hostels, cabanas e suítes para se hospedar em Pomaire · <em>Where to stay</em>",
    s_interes_title:"O que ver e pontos de interesse", s_interes_sub:"Atrações, lojas charmosas e experiências rápidas · <em>Highlights &amp; things to see</em>",
    lnk_map:"📍 Ver no mapa", lnk_zone:"📍 Ver zona", lnk_howto:"📍 Como chegar",
    pk1_badge:"Principal · Entrada norte", pk1_title:"Estacionamento Entrada Pomaire", pk1_detail:"Rua Rafael Morandé, em frente ao acesso principal. O maior do povoado. No fim de semana pode lotar antes das 11:00.",
    pk2_badge:"Lateral · Rua dos artesãos", pk2_title:"Estacionamento Rua 18 de Septiembre", pk2_detail:"Vagas na rua 18 de Septiembre, ao lado do centro histórico. Uma opção se a entrada norte estiver cheia.",
    pk3_badge:"Ônibus e vans", pk3_title:"Zona de ônibus turísticos", pk3_detail:"Setor destinado a ônibus e vans de turismo. Pergunte ao guarda na entrada norte.",
    pk4_badge:"Dica", pk4_title:"Dicas para estacionar", pk4_detail:"Chegando antes das 10:30 nos fins de semana você evita a lotação. Não bloqueie saídas de moradores nem estradas rurais.",
    he1_badge:"CESFAM · Pomaire", he1_detail:"Artesana Julita Vera 354, Pomaire",
    he2_badge:"Hospital · Melipilla", he2_detail:"O'Higgins 551, Melipilla · Pronto-socorro 24 h. Referência principal para casos graves a partir de Pomaire (≈15 min de carro).",
    he3_badge:"Emergência · 24 h", he3_title:"Ambulância SAMU — emergências", he3_detail:"Chamada gratuita de qualquer telefone, 24 horas por dia. Para acidentes, infarto e emergências vitais.", he3_link:"📞 Ligar 131",
    he4_badge:"Farmácia · Melipilla", he4_title:"Farmácias em Melipilla", he4_detail:"Em Pomaire há uma farmácia, na San Antonio 140. As farmácias de plantão giram diariamente.", he4_link:"🔗 Ver plantão de hoje",
    emn_police:"Carabineros", emn_samu:"Ambulância SAMU", emn_fire:"Bombeiros", emn_peace:"Segurança pública", emn_vif:"Violência doméstica · Mulher", emn_power:"Falta de luz CGE",
    se1_badge:"Carabineros · Pomaire", se1_title:"Posto policial de Pomaire", se1_detail:"Rua San Rafael 496. Atendimento local da polícia Carabineros.", se_emer133:"📞 Emergências 133", se1_link2:"📞 Emergências Plano Quadrante +56984289058",
    se2_badge:"Bombeiros · Melipilla", se2_title:"Central de Bombeiros de Melipilla", se2_detail:"Atendem Pomaire e localidades rurais. Em caso de incêndio ou resgate ligue 132.", se_emer132:"📞 Emergências 132",
    se3_badge:"Serviço elétrico", se3_title:"CGE — Falta de luz", se3_detail:"Para relatar falhas elétricas residenciais. Disponível 24 horas.",
    co1_badge:"Mercearia · Centro", co1_title:"Lojas na rua principal", co1_detail:"Várias mercearias e minimercados na Rafael Morandé e arredores. Vendem água, lanches e itens básicos para o visitante.",
    co2_badge:"Mecânico · Estrada", co2_title:"Mecânico / oficina automotiva", co2_detail:"Há pequenas oficinas na via de acesso e no caminho para Melipilla. Para panes graves o mais próximo fica na cidade de Melipilla.", co2_link:"📍 Buscar oficinas",
    co3_badge:"Combustível", co3_title:"Postos de gasolina", co3_detail:"O posto mais próximo fica na estrada para Melipilla. Recomenda-se chegar com o tanque cheio se vier de Santiago.",
    co4_badge:"Caixa · Dinheiro", co4_title:"Caixas eletrônicos", co4_detail:"Há um caixa eletrônico dentro do povoado, na rua Roberto Bravo 445. Muitos locais aceitam cartão.",
    co5_badge:"Correios / Encomendas", co5_title:"Correos Chile", co5_detail:"A agência de correios mais próxima fica na cidade de Melipilla. Organize os envios a partir de lá.",
    co6_badge:"Informação turística", co6_title:"Ponto de informação local", co6_detail:"Na entrada principal há sinalização turística. Os artesãos e comerciantes costumam orientar bem os visitantes.", co6_detail2:"Na praça de Pomaire há um ponto de informação turística.",
    pl1_badge:"Praça · Centro", pl1_title:"Praça de Pomaire", pl1_detail:"A praça central é o coração do povoado. Cercada de lojas de artesanato e gastronomia. Ideal para descansar e se orientar.",
    pl2_badge:"Igreja", pl2_detail:"Igreja histórica do povoado. Referência arquitetônica.",
    pl3_badge:"Salão do Reino", pl3_detail:"Espaço público espiritual. Horários: quinta 19:00 - 21:15. Sábado 19:00 - 20:45.",
    pl4_badge:"Serviços", pl4_title:"Banheiros públicos", pl4_detail:"Há banheiros perto da praça central e em alguns restaurantes. Na alta temporada pode haver fila.",
    al1_badge:"Artesanato · Rua principal", al1_title:"Rua dos oleiros", al1_detail:"Rafael Morandé é a rua principal, cheia de oficinas e lojas onde os artesãos trabalham e vendem ao vivo. Peças de barro: jarras, panelas, talhas e mais.",
    al2_badge:"Oficina aberta", al2_title:"Ver os oleiros trabalhando", al2_detail:"Muitos artesãos trabalham com seus tornos e fornos à vista. É possível ver todo o processo: do barro cru à peça pronta.",
    al3_badge:"Dicas de compra", al3_title:"Comprar artesanato com responsabilidade", al3_detail:"Prefira comprar diretamente do artesão. Evite pechinchar de forma agressiva — cada peça carrega trabalho e tradição familiar.",
    al4_badge:"Patrimônio", al4_title:"Patrimônio imaterial do Chile", al4_detail:"A olaria de Pomaire é reconhecida como patrimônio cultural. Técnicas transmitidas de geração em geração por séculos.",
    al5_badge:"Cofrinho", al5_title:"Maior cofrinho de barro do mundo", al5_detail:"Museu com figuras gigantes de barro",
    dir_taller_h:"🎨 Oficinas de barro", dir_taller_sub:"Aprenda a modelar o barro com artesãos de Pomaire · <em>Pottery workshops</em>",
    dir_demo_h:"🌀 Demonstrações no torno", dir_demo_sub:"Veja os mestres moldarem o barro ao vivo · <em>Pottery wheel demonstrations</em>",
    dir_arte_h:"🏺 Lojas e artesãos de barro", dir_arte_sub:"Compre diretamente do artesão. Lista completa dos oleiros de Pomaire · <em>Pottery shops &amp; artisans</em>",
    ga1_badge:"Prato principal", ga1_title:"Cazuela de barro", ga1_detail:"O prato mais icônico de Pomaire. Cazuelas, empanadas e pastel de choclo servidos em vasilhas de barro feitas no próprio povoado.",
    ga2_badge:"Clássico", ga2_title:"Empanadas gigantes", ga2_detail:"Pomaire é famoso por suas empanadas enormes. Há lojas de empanadas ao longo de toda a rua principal.",
    ga3_badge:"Bebidas", ga3_title:"Chicha e bebidas tradicionais", ga3_detail:"Chicha de maçã e uva, mote con huesillo e bebidas artesanais. Perfeitas para acompanhar a gastronomia local.",
    ga4_badge:"Onde comer", ga4_title:"Restaurantes e fondas", ga4_detail:"Numerosos restaurantes na rua principal e nas laterais. Nos fins de semana pode haver espera. Recomenda-se chegar antes do meio-dia.", ga4_link:"📋 Ver diretório", ga4_map:"🗺️ Ver no mapa",
    dir_rest_h:"🍴 Diretório de restaurantes", dir_rest_sub:"Restaurantes de Pomaire com endereço, telefone e dias de atendimento · <em>Restaurants directory</em>",
    lodging_note:"💡 Ficar para dormir permite curtir Pomaire sem a multidão dos ônibus de turismo e viver o povoado à noite.",
    dir_jardin_h:"🌱 Jardinagem e viveiros", dir_jardin_sub:"Plantas, flores e um respiro verde · <em>Gardening &amp; plants</em>",
    dir_serv_h:"📌 Pontos-chave e serviços", dir_serv_sub:"Locais úteis durante sua visita · <em>Key points &amp; services</em>",
    ar1_badge:"Setor rural · Próximo", ar1_detail:"Localidade rural muito perto de Pomaire. Paisagem de sequeiro costeiro com vinhedos e ravinas. Ideal para quem busca tranquilidade e natureza fora do centro turístico.",
    ar2_badge:"Rotas rurais", ar2_title:"Caminhos e vinhos do sequeiro", ar2_detail:"O entorno de Pomaire é zona vitivinícola tradicional. Pequenos produtores familiares de chicha e vinho no setor de Los Chiñihues e caminhos próximos.",
    ar3_badge:"Natureza", ar3_title:"Morros e ravinas", ar3_detail:"Os morros que cercam Pomaire oferecem vistas do vale de Melipilla. Há trilhas informais acessíveis pela via que liga o povoado a Los Chiñihues.",
    ar4_badge:"Acesso", ar4_title:"Como chegar de Santiago", ar4_detail:"Autopista del Sol (Rota 78) rumo a Melipilla. Saída no km 51 com sinalização para Pomaire. Cerca de 50 min de Santiago de carro.",
    ar5_badge:"Transporte público", ar5_title:"Ônibus de Santiago/Melipilla", ar5_detail:"Há ônibus do Terminal San Borja (Santiago) com parada em Melipilla. De Melipilla saem vans rurais para Pomaire regularmente.", ar5_link:"📍 Terminal Melipilla",
    ar6_badge:"Conectividade", ar6_title:"Sinal de celular e WiFi", ar6_detail:"O sinal de celular em Pomaire é razoável no centro, mas pode ser fraco em Los Chiñihues e setores rurais. Alguns restaurantes oferecem WiFi.",
    wine_title:"Rota do Vinho e da Chicha", wine_sub:"O sequeiro costeiro de Pomaire e Los Chiñihues, terra de vinhas tradicionais · <em>Wine &amp; chicha route</em>",
    wine_tag:"🍇 Experiência · Vale de Melipilla · Sequeiro Costeiro",
    wine_intro:"Além do barro, o entorno de Pomaire é <strong>terra de vinhas e parreiras tradicionais</strong>. No sequeiro costeiro e no setor de <strong>Los Chiñihues</strong> sobrevivem pequenos produtores familiares que elaboram <strong>chicha de maçã e uva</strong>, pipeño e vinho camponês com técnicas herdadas por gerações. Uma rota para descobrir o lado rural e festivo do povoado dos oleiros.",
    wine_c1_t:"Cepa País", wine_c1_d:"A uva tradicional do sequeiro chileno, base dos vinhos camponeses e do pipeño. Uma das cepas mais antigas do país, cultivada em parreirais rústicos da zona.",
    wine_c2_t:"Chicha artesanal", wine_c2_d:"A bebida emblemática do lugar: chicha de maçã e de uva, fresca e doce. Encontra-se nos restaurantes típicos e abunda especialmente nas Fiestas Patrias.",
    wine_c3_t:"Pipeño do sequeiro", wine_c3_d:"Vinho jovem e rústico, de caráter camponês, ideal para acompanhar uma cazuela ou uma empanada gigante. A harmonização perfeita da cozinha de Pomaire.",
    wine_c4_t:"Los Chiñihues", wine_c4_d:"Setor rural a poucos minutos de Pomaire, de vinhedos, ravinas e caminhos tranquilos. O coração da tradição vitivinícola familiar dos arredores.",
    wine_c5_t:"Harmonização no barro", wine_c5_d:"A chicha e o vinho são servidos em jarras e vasilhas de barro feitas no próprio povoado, unindo numa só experiência as duas grandes tradições de Pomaire.",
    wine_c6_t:"Melhor temporada", wine_c6_d:"A vindima (março–abril) e as Fiestas Patrias (setembro) são as épocas com mais chicha fresca, parreiras carregadas e clima festivo no sequeiro.",
    wine_steps_h:"🧭 Como percorrer a rota",
    wine_s1_t:"Comece no centro de Pomaire", wine_s1_d:"Prove uma chicha de maçã ou uva nos restaurantes típicos das ruas Roberto Bravo e San Antonio.",
    wine_s2_t:"Siga rumo a Los Chiñihues", wine_s2_d:"Percorra de carro os caminhos rurais do sequeiro, entre parreirais e ravinas. Leve o tanque cheio: há pouco sinal e poucos serviços.",
    wine_s3_t:"Procure os produtores familiares", wine_s3_d:"Pergunte no povoado por chicha e vinho artesanal da temporada; muitos são vendidos diretamente em casas e barracas do setor.",
    wine_s4_t:"Encerre com gastronomia", wine_s4_d:"Volte ao povoado e harmonize seu achado com uma cazuela ou empanada servida no barro. Saúde!",
    wine_cta_t:"🍷 Tem uma vinha, parreiral ou produz chicha na região? Some seu lugar a esta rota e apareça no guia.", wine_cta_btn:"🗺️ Ver Los Chiñihues",
    wine_note:"Rota baseada na tradição vitivinícola do sequeiro costeiro de Melipilla. Os produtores e horários variam conforme a temporada; consulte no povoado. Beba com moderação · apenas maiores de 18 anos.",
    or_title:"Rota Turística Oficial de Pomaire", or_src:"Itinerário sugerido pela Secretaria de Turismo · Município de Melipilla · <em>Official tourist route</em>",
    or_badge1:"🚶 A pé: ~35 min", or_badge2:"🚗 De carro: ~19 min", or_badge3:"📅 Dia completo desde Santiago",
    or_st1_t:"Saída de Santiago", or_st1_d:"Início da viagem rumo ao povoado dos oleiros.",
    or_st2_t:"Chegada a Pomaire", or_st2_d:"Recepção na Oficina de Informação Turística (OIT), na Praça de Pomaire.",
    or_st3_t:"Café da manhã no Imperio Pomaire", or_st3_d:"Roberto Bravo 78 · Sabores típicos chilenos para começar o dia.",
    or_st4_t:"Oficina de barro na Granja Alfarera", or_st4_d:"Bernardo O'Higgins 260 · Experiência imersiva: do torno ao forno.",
    or_st5_t:"Almoço no Restaurant La Greda", or_st5_d:"Cozinha caseira chilena e churrasco com mais de 30 anos de história.",
    or_st6_t:"Visita ao Vivero Luchín", or_st6_d:"San Antonio 191 · Um respiro verde entre plantas, flores e vasos.",
    or_st7_t:"Tarde livre para compras", or_st7_d:"Percorra as oficinas e lojas de barro da rua Roberto Bravo.",
    or_st8_t:"Retorno a Santiago", or_st8_d:"Fim do passeio com lembranças feitas à mão.",
    or_f1:"Nascido do esforço de Romina e Fabio pela cozinha tradicional. Após sete anos abriram um segundo local e hoje é uma referência dos sabores típicos de Pomaire.",
    or_f2:"Espaço turístico-cultural dedicado a preservar o ofício do barro. Oferece demonstrações ao vivo, oficinas com artesãos de Pomaire e um percurso por todo o processo, da extração ao forno.",
    or_f3:"Mais de 30 anos de tradição. Don Víctor Larraín transformou a antiga casa de adobe da família em uma referência gastronômica, berço da maior empanada do mundo e de três gerações de cozinha caseira.",
    or_f4:"Pequeno e encantador viveiro que combina o rural, o botânico e o artesanal. Ideal para uma pausa tranquila depois de percorrer oficinas e restaurantes, e para levar uma lembrança viva de Pomaire.",
    free_tour_label:"💡 Passeio livre · explore no seu ritmo",
    filter_lodging:"Dormir", filter_highlight:"Ver", route_oficial_name:"Rota Oficial", route_oficial_meta:"5 paradas · dia completo"
  },
  fr: {
    nav_lodging:"Hébergements", nav_seewhat:"À voir",
    nav_g_essentials:"Essentiels", nav_g_todo:"Que faire", nav_g_eatsleep:"Manger et dormir", nav_g_plan:"Planifier", nav_winery:"Route du Vin", site_municipality:"Mairie", site_official_map:"Voir la carte officielle de Pomaire",
    ev_m1:"JAN–FÉV", ev_m2:"JUIN", ev_m3:"SEP", ev_m4:"NOV–DÉC", weather_loading:"⏳ Chargement de la météo...", social_title:"Suivez-nous sur les réseaux", social_sub:"Photos, actualités et la vie du village des potiers, chaque jour.", social_ig:"Suivez-nous sur Instagram",
    a11y_title:"♿ Accessibilité", a11y_font:"🔠 Taille du texte", a11y_read:"🔊 Lecture à voix haute", a11y_readall:"📖 Tout lire", a11y_hint:"Activez la lecture puis touchez n'importe quel texte du site pour l'entendre à voix haute.", a11y_hint_active:"✅ Lecture active : touchez n'importe quel texte du site pour l'entendre.", a11y_activate:"🔊 Activer", a11y_stop:"⏹ Arrêter", a11y_unavailable:"🔇 Indisponible", a11y_size_normal:"Taille normale", a11y_size:"Taille", a11y_voice_on:"Lecture à voix haute activée. Touchez n'importe quel texte pour l'entendre.", a11y_no_support:"Votre navigateur ne prend pas en charge la lecture à voix haute.", a11y_aria_options:"Options d'accessibilité", a11y_aria_close:"Fermer",
    s_lodging_title:"Hébergements", s_lodging_sub:"Auberges, cabanes et suites pour séjourner à Pomaire · <em>Where to stay</em>",
    s_interes_title:"À voir et points d'intérêt", s_interes_sub:"Attractions, boutiques de charme et expériences en chemin · <em>Highlights &amp; things to see</em>",
    lnk_map:"📍 Voir sur la carte", lnk_zone:"📍 Voir la zone", lnk_howto:"📍 Comment s'y rendre",
    pk1_badge:"Principal · Entrée nord", pk1_title:"Parking Entrée Pomaire", pk1_detail:"Rue Rafael Morandé, face à l'accès principal. Le plus grand du village. Le week-end il peut se remplir avant 11h00.",
    pk2_badge:"Latéral · Rue des artisans", pk2_title:"Parking Rue 18 de Septiembre", pk2_detail:"Stationnement le long de la rue 18 de Septiembre, à côté du centre historique. Une option si l'entrée nord est pleine.",
    pk3_badge:"Bus et minibus", pk3_title:"Zone des bus touristiques", pk3_detail:"Secteur réservé aux bus et fourgons de tourisme. Demandez au gardien à l'entrée nord.",
    pk4_badge:"Conseil", pk4_title:"Conseils pour stationner", pk4_detail:"En arrivant avant 10h30 le week-end vous évitez la saturation. Ne bloquez pas les sorties des riverains ni les chemins ruraux.",
    he1_badge:"CESFAM · Pomaire", he1_detail:"Artesana Julita Vera 354, Pomaire",
    he2_badge:"Hôpital · Melipilla", he2_detail:"O'Higgins 551, Melipilla · Urgences 24h. Référence principale pour les cas graves depuis Pomaire (≈15 min en voiture).",
    he3_badge:"Urgence · 24h", he3_title:"Ambulance SAMU — urgences", he3_detail:"Appel gratuit depuis n'importe quel téléphone, 24h/24. Pour accidents, infarctus et urgences vitales.", he3_link:"📞 Appeler le 131",
    he4_badge:"Pharmacie · Melipilla", he4_title:"Pharmacies à Melipilla", he4_detail:"À Pomaire il y a une pharmacie, au San Antonio 140. Les pharmacies de garde tournent chaque jour.", he4_link:"🔗 Voir la garde du jour",
    emn_police:"Carabineros", emn_samu:"Ambulance SAMU", emn_fire:"Pompiers", emn_peace:"Sécurité publique", emn_vif:"Violences conjugales · Femmes", emn_power:"Coupure de courant CGE",
    se1_badge:"Carabineros · Pomaire", se1_title:"Poste de police de Pomaire", se1_detail:"Rue San Rafael 496. Service local de la police Carabineros.", se_emer133:"📞 Urgences 133", se1_link2:"📞 Urgences Plan Quadrant +56984289058",
    se2_badge:"Pompiers · Melipilla", se2_title:"Caserne de pompiers de Melipilla", se2_detail:"Ils interviennent pour Pomaire et les localités rurales. En cas d'incendie ou de sauvetage appelez le 132.", se_emer132:"📞 Urgences 132",
    se3_badge:"Service électrique", se3_title:"CGE — Coupure de courant", se3_detail:"Pour signaler les pannes électriques domestiques. Disponible 24h/24.",
    co1_badge:"Épicerie · Centre", co1_title:"Commerces de la rue principale", co1_detail:"Plusieurs épiceries et supérettes sur et autour de Rafael Morandé. Elles vendent de l'eau, des snacks et le nécessaire pour le visiteur.",
    co2_badge:"Mécanicien · Route", co2_title:"Mécanicien / garage automobile", co2_detail:"Il y a de petits garages sur la route d'accès et en allant vers Melipilla. Pour les pannes graves le plus proche est en ville de Melipilla.", co2_link:"📍 Chercher des garages",
    co3_badge:"Carburant", co3_title:"Stations-service", co3_detail:"La station-service la plus proche est sur la route de Melipilla. Il est conseillé d'arriver le réservoir plein si vous venez de Santiago.",
    co4_badge:"Distributeur · Espèces", co4_title:"Distributeurs automatiques", co4_detail:"Il y a un distributeur dans le village, rue Roberto Bravo 445. De nombreux commerces acceptent la carte.",
    co5_badge:"Poste / Colis", co5_title:"Correos Chile", co5_detail:"Le bureau de poste le plus proche est en ville de Melipilla. Organisez vos envois depuis là-bas.",
    co6_badge:"Information touristique", co6_title:"Point d'information local", co6_detail:"À l'entrée principale il y a une signalétique touristique. Les artisans et commerçants orientent en général bien les visiteurs.", co6_detail2:"Sur la place de Pomaire se trouve un point d'information touristique.",
    pl1_badge:"Place · Centre", pl1_title:"Place de Pomaire", pl1_detail:"La place centrale est le cœur du village. Entourée de boutiques d'artisanat et de restaurants. Idéale pour se reposer et s'orienter.",
    pl2_badge:"Église", pl2_detail:"Église historique du village. Repère architectural.",
    pl3_badge:"Salle du Royaume", pl3_detail:"Espace public spirituel. Horaires : jeudi 19h00 - 21h15. Samedi 19h00 - 20h45.",
    pl4_badge:"Services", pl4_title:"Toilettes publiques", pl4_detail:"Il y a des toilettes près de la place centrale et dans certains restaurants. En haute saison il peut y avoir la queue.",
    al1_badge:"Artisanat · Rue principale", al1_title:"Rue des potiers", al1_detail:"Rafael Morandé est la rue principale, pleine d'ateliers et de boutiques où les artisans travaillent et vendent en direct. Pièces en argile : cruches, marmites, jarres et plus.",
    al2_badge:"Atelier ouvert", al2_title:"Voir les potiers à l'œuvre", al2_detail:"De nombreux artisans travaillent avec leurs tours et fours à la vue. On peut voir tout le processus : de l'argile crue à la pièce terminée.",
    al3_badge:"Conseils d'achat", al3_title:"Acheter l'artisanat de façon responsable", al3_detail:"Préférez acheter directement à l'artisan. Évitez de marchander agressivement — chaque pièce porte du travail et une tradition familiale.",
    al4_badge:"Patrimoine", al4_title:"Patrimoine immatériel du Chili", al4_detail:"La poterie de Pomaire est reconnue comme patrimoine culturel. Des techniques transmises de génération en génération depuis des siècles.",
    al5_badge:"Tirelire", al5_title:"Plus grande tirelire en argile du monde", al5_detail:"Musée avec des figures géantes en argile",
    dir_taller_h:"🎨 Ateliers d'argile", dir_taller_sub:"Apprenez à modeler l'argile avec les artisans de Pomaire · <em>Pottery workshops</em>",
    dir_demo_h:"🌀 Démonstrations au tour", dir_demo_sub:"Voyez les maîtres façonner l'argile en direct · <em>Pottery wheel demonstrations</em>",
    dir_arte_h:"🏺 Boutiques et artisans d'argile", dir_arte_sub:"Achetez directement à l'artisan. Liste complète des potiers de Pomaire · <em>Pottery shops &amp; artisans</em>",
    ga1_badge:"Plat phare", ga1_title:"Cazuela en argile", ga1_detail:"Le plat le plus emblématique de Pomaire. Cazuelas, empanadas et pastel de choclo servis dans des récipients en argile fabriqués dans le village même.",
    ga2_badge:"Classique", ga2_title:"Empanadas géantes", ga2_detail:"Pomaire est célèbre pour ses empanadas de grande taille. Il y a des boutiques d'empanadas tout au long de la rue principale.",
    ga3_badge:"Boissons", ga3_title:"Chicha et boissons traditionnelles", ga3_detail:"Chicha de pomme et de raisin, mote con huesillo et boissons artisanales. Parfaites pour accompagner la cuisine locale.",
    ga4_badge:"Où manger", ga4_title:"Restaurants et auberges", ga4_detail:"De nombreux restaurants sur la rue principale et ses rues adjacentes. Le week-end il peut y avoir de l'attente. Il est conseillé d'arriver avant midi.", ga4_link:"📋 Voir l'annuaire", ga4_map:"🗺️ Voir sur la carte",
    dir_rest_h:"🍴 Annuaire des restaurants", dir_rest_sub:"Restaurants de Pomaire avec adresse, téléphone et jours d'ouverture · <em>Restaurants directory</em>",
    lodging_note:"💡 Passer la nuit vous permet de profiter de Pomaire sans la foule des bus de tourisme et de vivre le village la nuit.",
    dir_jardin_h:"🌱 Jardinage et pépinières", dir_jardin_sub:"Plantes, fleurs et une pause verte · <em>Gardening &amp; plants</em>",
    dir_serv_h:"📌 Points clés et services", dir_serv_sub:"Lieux utiles pendant votre visite · <em>Key points &amp; services</em>",
    ar1_badge:"Secteur rural · Proche", ar1_detail:"Localité rurale très proche de Pomaire. Paysage de terres sèches côtières avec vignobles et ravins. Idéale pour ceux qui cherchent calme et nature hors du centre touristique.",
    ar2_badge:"Routes rurales", ar2_title:"Chemins et vins des terres sèches", ar2_detail:"Les environs de Pomaire sont une zone viticole traditionnelle. De petits producteurs familiaux de chicha et de vin dans le secteur de Los Chiñihues et les chemins voisins.",
    ar3_badge:"Nature", ar3_title:"Collines et ravins", ar3_detail:"Les collines qui entourent Pomaire offrent des vues sur la vallée de Melipilla. Il y a des sentiers informels accessibles depuis la route reliant le village à Los Chiñihues.",
    ar4_badge:"Accès", ar4_title:"Comment venir de Santiago", ar4_detail:"Autopista del Sol (Route 78) vers Melipilla. Sortie au km 51 avec signalétique vers Pomaire. Environ 50 min de Santiago en voiture.",
    ar5_badge:"Transports en commun", ar5_title:"Bus depuis Santiago/Melipilla", ar5_detail:"Il y a des bus depuis le Terminal San Borja (Santiago) avec arrêt à Melipilla. Depuis Melipilla, des minibus ruraux partent régulièrement vers Pomaire.", ar5_link:"📍 Terminal Melipilla",
    ar6_badge:"Connectivité", ar6_title:"Réseau mobile et WiFi", ar6_detail:"Le réseau mobile à Pomaire est correct au centre, mais peut être faible à Los Chiñihues et dans les secteurs ruraux. Certains restaurants proposent le WiFi.",
    wine_title:"Route du Vin et de la Chicha", wine_sub:"Les terres sèches côtières de Pomaire et Los Chiñihues, terre de vignes traditionnelles · <em>Wine &amp; chicha route</em>",
    wine_tag:"🍇 Expérience · Vallée de Melipilla · Terres sèches côtières",
    wine_intro:"Au-delà de l'argile, les environs de Pomaire sont <strong>une terre de vignes et de treilles traditionnelles</strong>. Dans les terres sèches côtières et le secteur de <strong>Los Chiñihues</strong> survivent de petits producteurs familiaux qui élaborent <strong>de la chicha de pomme et de raisin</strong>, du pipeño et du vin paysan avec des techniques héritées de générations. Un itinéraire pour découvrir le côté rural et festif du village des potiers.",
    wine_c1_t:"Cépage País", wine_c1_d:"Le raisin traditionnel des terres sèches chiliennes, base des vins paysans et du pipeño. L'un des cépages les plus anciens du pays, cultivé sur des treilles rustiques de la zone.",
    wine_c2_t:"Chicha artisanale", wine_c2_d:"La boisson emblématique du lieu : chicha de pomme et de raisin, fraîche et douce. On la trouve dans les restaurants typiques et elle abonde surtout autour des Fêtes nationales.",
    wine_c3_t:"Pipeño des terres sèches", wine_c3_d:"Vin jeune et rustique, de caractère paysan, idéal pour accompagner une cazuela ou une empanada géante. L'accord parfait de la cuisine de Pomaire.",
    wine_c4_t:"Los Chiñihues", wine_c4_d:"Secteur rural à quelques minutes de Pomaire, fait de vignobles, de ravins et de chemins paisibles. Le cœur de la tradition viticole familiale des environs.",
    wine_c5_t:"Accord en argile", wine_c5_d:"La chicha et le vin sont servis dans des cruches et récipients en argile faits dans le village même, unissant en une seule expérience les deux grandes traditions de Pomaire.",
    wine_c6_t:"Meilleure saison", wine_c6_d:"Les vendanges (mars–avril) et les Fêtes nationales (septembre) sont les périodes avec le plus de chicha fraîche, de treilles chargées et d'ambiance festive dans les terres sèches.",
    wine_steps_h:"🧭 Comment parcourir l'itinéraire",
    wine_s1_t:"Commencez au centre de Pomaire", wine_s1_d:"Goûtez une chicha de pomme ou de raisin dans les restaurants typiques des rues Roberto Bravo et San Antonio.",
    wine_s2_t:"Dirigez-vous vers Los Chiñihues", wine_s2_d:"Parcourez en voiture les chemins ruraux des terres sèches, entre treilles et ravins. Faites le plein : il y a peu de réseau et peu de services.",
    wine_s3_t:"Cherchez les producteurs familiaux", wine_s3_d:"Demandez au village la chicha et le vin artisanal de saison ; beaucoup se vendent directement dans les maisons et étals du secteur.",
    wine_s4_t:"Terminez par la gastronomie", wine_s4_d:"Revenez au village et accordez votre trouvaille avec une cazuela ou une empanada servie en argile. Santé !",
    wine_cta_t:"🍷 Vous avez une vigne, une treille ou produisez de la chicha dans la région ? Ajoutez votre lieu à cet itinéraire et apparaissez dans le guide.", wine_cta_btn:"🗺️ Voir Los Chiñihues",
    wine_note:"Itinéraire basé sur la tradition viticole des terres sèches côtières de Melipilla. Les producteurs et horaires varient selon la saison ; renseignez-vous au village. À consommer avec modération · réservé aux plus de 18 ans.",
    or_title:"Itinéraire Touristique Officiel de Pomaire", or_src:"Itinéraire suggéré par l'Office de Tourisme · Municipalité de Melipilla · <em>Official tourist route</em>",
    or_badge1:"🚶 À pied : ~35 min", or_badge2:"🚗 En voiture : ~19 min", or_badge3:"📅 Journée complète depuis Santiago",
    or_st1_t:"Départ de Santiago", or_st1_d:"Début du voyage vers le village des potiers.",
    or_st2_t:"Arrivée à Pomaire", or_st2_d:"Accueil à l'Office d'Information Touristique (OIT), sur la place de Pomaire.",
    or_st3_t:"Petit-déjeuner à Imperio Pomaire", or_st3_d:"Roberto Bravo 78 · Saveurs chiliennes typiques pour commencer la journée.",
    or_st4_t:"Atelier d'argile à la Granja Alfarera", or_st4_d:"Bernardo O'Higgins 260 · Expérience immersive : du tour au four.",
    or_st5_t:"Déjeuner au Restaurant La Greda", or_st5_d:"Cuisine créole chilienne et grillades avec plus de 30 ans d'histoire.",
    or_st6_t:"Visite du Vivero Luchín", or_st6_d:"San Antonio 191 · Une pause verte parmi les plantes, les fleurs et les pots.",
    or_st7_t:"Après-midi libre pour le shopping", or_st7_d:"Parcourez les ateliers et boutiques d'argile de la rue Roberto Bravo.",
    or_st8_t:"Retour à Santiago", or_st8_d:"Fin du parcours avec des souvenirs faits main.",
    or_f1:"Né de l'effort de Romina et Fabio pour la cuisine traditionnelle. Après sept ans ils ont ouvert un second local et c'est aujourd'hui une référence des saveurs typiques de Pomaire.",
    or_f2:"Espace touristico-culturel dédié à préserver le métier de l'argile. Il propose des démonstrations en direct, des ateliers avec des artisans de Pomaire et un parcours de tout le processus, de l'extraction au four.",
    or_f3:"Plus de 30 ans de tradition. Don Víctor Larraín a transformé l'ancienne maison familiale en adobe en une référence gastronomique, berceau de la plus grande empanada du monde et de trois générations de cuisine créole.",
    or_f4:"Petite pépinière charmante qui combine le rural, le botanique et l'artisanal. Idéale pour une pause tranquille après avoir parcouru ateliers et restaurants, et pour emporter un souvenir vivant de Pomaire.",
    free_tour_label:"💡 Parcours libre · explorez à votre rythme",
    filter_lodging:"Dormir", filter_highlight:"À voir", route_oficial_name:"Itinéraire Officiel", route_oficial_meta:"5 arrêts · journée complète"
  },
  ru: {
    nav_lodging:"Жильё", nav_seewhat:"Что посмотреть",
    nav_g_essentials:"Главное", nav_g_todo:"Чем заняться", nav_g_eatsleep:"Еда и ночлег", nav_g_plan:"Планирование", nav_winery:"Винный маршрут", site_municipality:"Муниципалитет", site_official_map:"Официальная карта Помайре",
    ev_m1:"ЯНВ–ФЕВ", ev_m2:"ИЮН", ev_m3:"СЕН", ev_m4:"НОЯ–ДЕК", weather_loading:"⏳ Загрузка погоды...", social_title:"Подпишитесь на нас", social_sub:"Фото, новости и жизнь гончарного посёлка каждый день.", social_ig:"Подпишитесь в Instagram",
    a11y_title:"♿ Доступность", a11y_font:"🔠 Размер шрифта", a11y_read:"🔊 Чтение вслух", a11y_readall:"📖 Читать всё", a11y_hint:"Включите чтение и затем нажмите на любой текст сайта, чтобы услышать его вслух.", a11y_hint_active:"✅ Чтение включено: нажмите на любой текст сайта, чтобы услышать его.", a11y_activate:"🔊 Включить", a11y_stop:"⏹ Остановить", a11y_unavailable:"🔇 Недоступно", a11y_size_normal:"Обычный размер", a11y_size:"Размер", a11y_voice_on:"Чтение вслух включено. Нажмите на любой текст, чтобы услышать его.", a11y_no_support:"Ваш браузер не поддерживает чтение вслух.", a11y_aria_options:"Параметры доступности", a11y_aria_close:"Закрыть",
    s_lodging_title:"Жильё", s_lodging_sub:"Хостелы, домики и сьюты для ночёвки в Помайре · <em>Where to stay</em>",
    s_interes_title:"Что посмотреть и точки интереса", s_interes_sub:"Достопримечательности, уютные магазины и впечатления по пути · <em>Highlights &amp; things to see</em>",
    lnk_map:"📍 На карте", lnk_zone:"📍 Показать зону", lnk_howto:"📍 Как добраться",
    pk1_badge:"Главная · Северный въезд", pk1_title:"Парковка у въезда в Помайре", pk1_detail:"Улица Rafael Morandé, напротив главного въезда. Самая большая в посёлке. В выходные может заполниться до 11:00.",
    pk2_badge:"Боковая · Улица ремесленников", pk2_title:"Парковка на улице 18 de Septiembre", pk2_detail:"Обочины на улице 18 de Septiembre, рядом с центром. Вариант, если северный въезд занят.",
    pk3_badge:"Автобусы и микроавтобусы", pk3_title:"Зона туристических автобусов", pk3_detail:"Сектор для туристических автобусов и фургонов. Спросите охранника у северного въезда.",
    pk4_badge:"Совет", pk4_title:"Советы по парковке", pk4_detail:"Приезжая до 10:30 в выходные, вы избежите наплыва. Не перекрывайте выезды жителей и сельские дороги.",
    he1_badge:"CESFAM · Помайре", he1_detail:"Artesana Julita Vera 354, Помайре",
    he2_badge:"Больница · Мелипилья", he2_detail:"O'Higgins 551, Мелипилья · Скорая помощь 24 ч. Основной центр для тяжёлых случаев из Помайре (≈15 мин на машине).",
    he3_badge:"Экстренная · 24 ч", he3_title:"Скорая SAMU — экстренные случаи", he3_detail:"Бесплатный звонок с любого телефона, круглосуточно. При авариях, инфаркте и угрозе жизни.", he3_link:"📞 Звонить 131",
    he4_badge:"Аптека · Мелипилья", he4_title:"Аптеки в Мелипилье", he4_detail:"В Помайре есть аптека по адресу San Antonio 140. Дежурные аптеки меняются ежедневно.", he4_link:"🔗 Дежурная аптека сегодня",
    emn_police:"Полиция (Carabineros)", emn_samu:"Скорая SAMU", emn_fire:"Пожарные", emn_peace:"Общественная безопасность", emn_vif:"Домашнее насилие · Женщины", emn_power:"Отключение света CGE",
    se1_badge:"Полиция · Помайре", se1_title:"Полицейский участок Помайре", se1_detail:"Улица San Rafael 496. Местная служба полиции Carabineros.", se_emer133:"📞 Экстренный 133", se1_link2:"📞 Экстренный «План Квадрант» +56984289058",
    se2_badge:"Пожарные · Мелипилья", se2_title:"Пожарная часть Мелипильи", se2_detail:"Выезжают в Помайре и сельские районы. При пожаре или спасении звоните 132.", se_emer132:"📞 Экстренный 132",
    se3_badge:"Электроснабжение", se3_title:"CGE — Отключение света", se3_detail:"Для сообщений о бытовых неполадках с электричеством. Доступно круглосуточно.",
    co1_badge:"Магазин · Центр", co1_title:"Магазины на главной улице", co1_detail:"Несколько магазинов и минимаркетов на Rafael Morandé и рядом. Продают воду, снеки и базовые товары для гостей.",
    co2_badge:"Механик · Трасса", co2_title:"Механик / автомастерская", co2_detail:"Небольшие мастерские есть на подъездной дороге и по пути в Мелипилью. При серьёзных поломках ближайшая помощь — в городе Мелипилья.", co2_link:"📍 Найти мастерские",
    co3_badge:"Топливо", co3_title:"Заправки", co3_detail:"Ближайшая заправка находится на дороге в Мелипилью. Рекомендуется приезжать с полным баком, если едете из Сантьяго.",
    co4_badge:"Банкомат · Наличные", co4_title:"Банкоматы", co4_detail:"В посёлке есть банкомат по адресу Roberto Bravo 445. Многие заведения принимают карты.",
    co5_badge:"Почта / Посылки", co5_title:"Correos Chile", co5_detail:"Ближайшее почтовое отделение — в городе Мелипилья. Отправляйте посылки оттуда.",
    co6_badge:"Туристическая информация", co6_title:"Местный информационный пункт", co6_detail:"У главного въезда есть туристические указатели. Ремесленники и торговцы обычно хорошо подсказывают гостям.", co6_detail2:"На площади Помайре есть туристический информационный пункт.",
    pl1_badge:"Площадь · Центр", pl1_title:"Главная площадь Помайре", pl1_detail:"Центральная площадь — сердце посёлка. Вокруг магазины ремёсел и кафе. Идеально, чтобы отдохнуть и сориентироваться.",
    pl2_badge:"Церковь", pl2_detail:"Историческая церковь посёлка. Архитектурный ориентир.",
    pl3_badge:"Зал Царства", pl3_detail:"Общественное духовное пространство. Часы: четверг 19:00 - 21:15. Суббота 19:00 - 20:45.",
    pl4_badge:"Услуги", pl4_title:"Общественные туалеты", pl4_detail:"Туалеты есть рядом с центральной площадью и в некоторых ресторанах. В высокий сезон может быть очередь.",
    al1_badge:"Ремёсла · Главная улица", al1_title:"Улица гончаров", al1_detail:"Rafael Morandé — главная улица, полная мастерских и магазинов, где ремесленники работают и продают прямо на месте. Изделия из глины: кувшины, горшки, кувшины и многое другое.",
    al2_badge:"Открытая мастерская", al2_title:"Посмотреть на работу гончаров", al2_detail:"Многие мастера работают на гончарных кругах и у печей на виду. Можно увидеть весь процесс: от сырой глины до готового изделия.",
    al3_badge:"Советы по покупкам", al3_title:"Покупайте ремёсла ответственно", al3_detail:"Предпочитайте покупать напрямую у мастера. Не торгуйтесь агрессивно — за каждым изделием стоит труд и семейная традиция.",
    al4_badge:"Наследие", al4_title:"Нематериальное наследие Чили", al4_detail:"Гончарное дело Помайре признано культурным наследием. Техники передаются из поколения в поколение веками.",
    al5_badge:"Копилка", al5_title:"Самая большая глиняная копилка в мире", al5_detail:"Музей с гигантскими глиняными фигурами",
    dir_taller_h:"🎨 Мастерские глины", dir_taller_sub:"Научитесь лепить из глины с мастерами Помайре · <em>Pottery workshops</em>",
    dir_demo_h:"🌀 Демонстрации на круге", dir_demo_sub:"Посмотрите, как мастера лепят глину вживую · <em>Pottery wheel demonstrations</em>",
    dir_arte_h:"🏺 Магазины и мастера глины", dir_arte_sub:"Покупайте напрямую у мастера. Полный список гончаров Помайре · <em>Pottery shops &amp; artisans</em>",
    ga1_badge:"Фирменное блюдо", ga1_title:"Касуэла в глиняном горшке", ga1_detail:"Самое знаковое блюдо Помайре. Касуэлы, эмпанадас и pastel de choclo подают в глиняной посуде, сделанной в самом посёлке.",
    ga2_badge:"Классика", ga2_title:"Гигантские эмпанадас", ga2_detail:"Помайре славится огромными эмпанадас. Заведения с эмпанадас встречаются вдоль всей главной улицы.",
    ga3_badge:"Напитки", ga3_title:"Чича и традиционные напитки", ga3_detail:"Яблочная и виноградная чича, mote con huesillo и ремесленные напитки. Прекрасно дополняют местную кухню.",
    ga4_badge:"Где поесть", ga4_title:"Рестораны и закусочные", ga4_detail:"Множество ресторанов на главной улице и в переулках. В выходные возможно ожидание. Рекомендуем приходить до полудня.", ga4_link:"📋 Открыть каталог", ga4_map:"🗺️ Показать на карте",
    dir_rest_h:"🍴 Каталог ресторанов", dir_rest_sub:"Рестораны Помайре с адресом, телефоном и днями работы · <em>Restaurants directory</em>",
    lodging_note:"💡 Остаться на ночь позволяет насладиться Помайре без толп туристических автобусов и почувствовать посёлок ночью.",
    dir_jardin_h:"🌱 Садоводство и питомники", dir_jardin_sub:"Растения, цветы и зелёная передышка · <em>Gardening &amp; plants</em>",
    dir_serv_h:"📌 Ключевые точки и услуги", dir_serv_sub:"Полезные места во время вашего визита · <em>Key points &amp; services</em>",
    ar1_badge:"Сельский сектор · Рядом", ar1_detail:"Сельская местность совсем рядом с Помайре. Прибрежный засушливый ландшафт с виноградниками и оврагами. Идеально для тех, кто ищет тишину и природу вдали от туристического центра.",
    ar2_badge:"Сельские маршруты", ar2_title:"Дороги и вина засушливых земель", ar2_detail:"Окрестности Помайре — традиционный винодельческий район. Небольшие семейные производители чичи и вина в секторе Los Chiñihues и соседних дорогах.",
    ar3_badge:"Природа", ar3_title:"Холмы и овраги", ar3_detail:"Холмы вокруг Помайре открывают виды на долину Мелипильи. Есть неформальные тропы, доступные с дороги, соединяющей посёлок с Los Chiñihues.",
    ar4_badge:"Доступ", ar4_title:"Как добраться из Сантьяго", ar4_detail:"Autopista del Sol (трасса 78) в сторону Мелипильи. Съезд на 51-м км с указателями на Помайре. Примерно 50 мин из Сантьяго на машине.",
    ar5_badge:"Общественный транспорт", ar5_title:"Автобусы из Сантьяго/Мелипильи", ar5_detail:"Есть автобусы от Terminal San Borja (Сантьяго) с остановкой в Мелипилье. Из Мелипильи регулярно ходят сельские маршрутки в Помайре.", ar5_link:"📍 Терминал Мелипилья",
    ar6_badge:"Связь", ar6_title:"Мобильная связь и WiFi", ar6_detail:"Сотовая связь в Помайре приемлемая в центре, но может быть слабой в Los Chiñihues и сельских районах. Некоторые рестораны предлагают WiFi.",
    wine_title:"Маршрут вина и чичи", wine_sub:"Прибрежные засушливые земли Помайре и Los Chiñihues, край традиционных виноградников · <em>Wine &amp; chicha route</em>",
    wine_tag:"🍇 Впечатление · Долина Мелипильи · Прибрежные засушливые земли",
    wine_intro:"Помимо глины, окрестности Помайре — <strong>край традиционных виноградников и беседок</strong>. В прибрежных засушливых землях и секторе <strong>Los Chiñihues</strong> сохраняются небольшие семейные производители, которые делают <strong>яблочную и виноградную чичу</strong>, пипеньо и крестьянское вино по техникам, переданным поколениями. Маршрут, чтобы открыть сельскую и праздничную сторону гончарного посёлка.",
    wine_c1_t:"Сорт País", wine_c1_d:"Традиционный виноград чилийских засушливых земель, основа крестьянских вин и пипеньо. Один из старейших сортов страны, выращиваемый на простых беседках региона.",
    wine_c2_t:"Ремесленная чича", wine_c2_d:"Знаковый напиток места: яблочная и виноградная чича, свежая и сладкая. Встречается в типичных ресторанах и особенно изобилует вокруг национальных праздников.",
    wine_c3_t:"Пипеньо засушливых земель", wine_c3_d:"Молодое и простое крестьянское вино, идеальное к касуэле или гигантской эмпанаде. Идеальное сочетание для кухни Помайре.",
    wine_c4_t:"Los Chiñihues", wine_c4_d:"Сельский сектор в нескольких минутах от Помайре, с виноградниками, оврагами и спокойными дорогами. Сердце семейной винодельческой традиции окрестностей.",
    wine_c5_t:"Сочетание в глине", wine_c5_d:"Чичу и вино подают в глиняных кувшинах и сосудах, сделанных в самом посёлке, объединяя в одном впечатлении две великие традиции Помайре.",
    wine_c6_t:"Лучший сезон", wine_c6_d:"Сбор урожая (март–апрель) и национальные праздники (сентябрь) — время с наибольшим количеством свежей чичи, наполненных беседок и праздничной атмосферы в засушливых землях.",
    wine_steps_h:"🧭 Как пройти маршрут",
    wine_s1_t:"Начните в центре Помайре", wine_s1_d:"Попробуйте яблочную или виноградную чичу в типичных ресторанах на улицах Roberto Bravo и San Antonio.",
    wine_s2_t:"Двигайтесь к Los Chiñihues", wine_s2_d:"Проедьте на машине сельские дороги засушливых земель, среди беседок и оврагов. Залейте полный бак: связи мало и услуг немного.",
    wine_s3_t:"Ищите семейных производителей", wine_s3_d:"Спрашивайте в посёлке сезонную чичу и ремесленное вино; многие продаются прямо в домах и на прилавках района.",
    wine_s4_t:"Завершите гастрономией", wine_s4_d:"Вернитесь в посёлок и сочетайте находку с касуэлой или эмпанадой в глиняной посуде. Будем здоровы!",
    wine_cta_t:"🍷 У вас есть виноградник, беседка или вы делаете чичу в районе? Добавьте своё место на этот маршрут и появитесь в гиде.", wine_cta_btn:"🗺️ Смотреть Los Chiñihues",
    wine_note:"Маршрут основан на винодельческой традиции прибрежных засушливых земель Мелипильи. Производители и часы меняются в зависимости от сезона; уточняйте в посёлке. Пейте умеренно · только для лиц старше 18 лет.",
    or_title:"Официальный туристический маршрут Помайре", or_src:"Маршрут, предложенный Управлением туризма · Муниципалитет Мелипильи · <em>Official tourist route</em>",
    or_badge1:"🚶 Пешком: ~35 мин", or_badge2:"🚗 На машине: ~19 мин", or_badge3:"📅 Полный день из Сантьяго",
    or_st1_t:"Отъезд из Сантьяго", or_st1_d:"Начало поездки в гончарный посёлок.",
    or_st2_t:"Прибытие в Помайре", or_st2_d:"Встреча в Туристическом информационном бюро (OIT) на площади Помайре.",
    or_st3_t:"Завтрак в Imperio Pomaire", or_st3_d:"Roberto Bravo 78 · Типичные чилийские вкусы, чтобы начать день.",
    or_st4_t:"Мастерская глины в Granja Alfarera", or_st4_d:"Bernardo O'Higgins 260 · Погружающий опыт: от круга до печи.",
    or_st5_t:"Обед в Restaurant La Greda", or_st5_d:"Чилийская домашняя кухня и гриль с историей более 30 лет.",
    or_st6_t:"Посещение Vivero Luchín", or_st6_d:"San Antonio 191 · Зелёная передышка среди растений, цветов и кашпо.",
    or_st7_t:"Свободный день для покупок", or_st7_d:"Прогуляйтесь по мастерским и магазинам глины на улице Roberto Bravo.",
    or_st8_t:"Возвращение в Сантьяго", or_st8_d:"Завершение тура с сувенирами ручной работы.",
    or_f1:"Родилось из старания Romina и Fabio о традиционной кухне. Через семь лет они открыли второе заведение, и сегодня это эталон типичных вкусов Помайре.",
    or_f2:"Туристско-культурное пространство, посвящённое сохранению ремесла глины. Предлагает живые демонстрации, мастер-классы с мастерами Помайре и обзор всего процесса — от добычи до печи.",
    or_f3:"Более 30 лет традиции. Don Víctor Larraín превратил старый семейный дом из самана в гастрономический ориентир, родину самой большой эмпанады в мире и трёх поколений домашней кухни.",
    or_f4:"Небольшой и очаровательный питомник, сочетающий сельское, ботаническое и ремесленное. Идеален для спокойной паузы после мастерских и ресторанов и чтобы увезти живую память о Помайре.",
    free_tour_label:"💡 Свободный маршрут · исследуйте в своём темпе",
    filter_lodging:"Ночлег", filter_highlight:"Посмотреть", route_oficial_name:"Официальный маршрут", route_oficial_meta:"5 остановок · полный день"
  },
  ja: {
    nav_lodging:"宿泊", nav_seewhat:"見どころ",
    nav_g_essentials:"基本情報", nav_g_todo:"観光・体験", nav_g_eatsleep:"食事と宿泊", nav_g_plan:"計画", nav_winery:"ワインの道", site_municipality:"市役所", site_official_map:"ポマイレ公式地図を見る",
    ev_m1:"1〜2月", ev_m2:"6月", ev_m3:"9月", ev_m4:"11〜12月", weather_loading:"⏳ 天気を読み込み中...", social_title:"SNSでフォロー", social_sub:"毎日、陶工の村の写真・お知らせ・暮らしをお届け。", social_ig:"Instagramでフォロー",
    a11y_title:"♿ アクセシビリティ", a11y_font:"🔠 文字サイズ", a11y_read:"🔊 読み上げ", a11y_readall:"📖 すべて読む", a11y_hint:"読み上げをオンにして、サイトの任意のテキストをタップすると音声で読み上げます。", a11y_hint_active:"✅ 読み上げ中：サイトの任意のテキストをタップして聞いてください。", a11y_activate:"🔊 オンにする", a11y_stop:"⏹ 停止", a11y_unavailable:"🔇 利用不可", a11y_size_normal:"標準サイズ", a11y_size:"サイズ", a11y_voice_on:"読み上げをオンにしました。任意のテキストをタップして聞いてください。", a11y_no_support:"お使いのブラウザは読み上げに対応していません。", a11y_aria_options:"アクセシビリティ オプション", a11y_aria_close:"閉じる",
    s_lodging_title:"宿泊", s_lodging_sub:"ポマイレに泊まるためのホステル・コテージ・スイート · <em>Where to stay</em>",
    s_interes_title:"見どころと観光スポット", s_interes_sub:"名所、魅力的な店、立ち寄り体験 · <em>Highlights &amp; things to see</em>",
    lnk_map:"📍 地図で見る", lnk_zone:"📍 エリアを見る", lnk_howto:"📍 行き方",
    pk1_badge:"メイン · 北入口", pk1_title:"ポマイレ入口駐車場", pk1_detail:"Rafael Morandé通り、メインアクセスの正面。村で最大。週末は11:00前に満車になることがあります。",
    pk2_badge:"側道 · 職人通り", pk2_title:"18 de Septiembre通り駐車場", pk2_detail:"中心部の脇、18 de Septiembre通りの路肩。北入口が満車のときの選択肢です。",
    pk3_badge:"バス・ミニバス", pk3_title:"観光バス用ゾーン", pk3_detail:"観光バスやバン向けの区画。北入口の警備員にお尋ねください。",
    pk4_badge:"アドバイス", pk4_title:"駐車のヒント", pk4_detail:"週末は10:30前に到着すると混雑を避けられます。住民の出入口や農道をふさがないでください。",
    he1_badge:"CESFAM · ポマイレ", he1_detail:"Artesana Julita Vera 354, ポマイレ",
    he2_badge:"病院 · メリピージャ", he2_detail:"O'Higgins 551, メリピージャ · 救急24時間。ポマイレからの重症例の主要拠点（車で約15分）。",
    he3_badge:"緊急 · 24時間", he3_title:"SAMU救急車 — 緊急", he3_detail:"どの電話からも24時間無料通話。事故・心臓発作・生命の危険がある緊急時に。", he3_link:"📞 131に電話",
    he4_badge:"薬局 · メリピージャ", he4_title:"メリピージャの薬局", he4_detail:"ポマイレには薬局が1軒あります（San Antonio 140）。当番薬局は毎日交代します。", he4_link:"🔗 本日の当番を見る",
    emn_police:"警察（Carabineros）", emn_samu:"SAMU救急車", emn_fire:"消防", emn_peace:"市民安全", emn_vif:"家庭内暴力 · 女性", emn_power:"CGE停電",
    se1_badge:"警察 · ポマイレ", se1_title:"ポマイレ警察署", se1_detail:"San Rafael 496通り。Carabineros警察の地域窓口。", se_emer133:"📞 緊急 133", se1_link2:"📞 緊急 クアドラント計画 +56984289058",
    se2_badge:"消防 · メリピージャ", se2_title:"メリピージャ消防本部", se2_detail:"ポマイレと農村部に対応します。火災や救助の際は132に電話してください。", se_emer132:"📞 緊急 132",
    se3_badge:"電力サービス", se3_title:"CGE — 停電", se3_detail:"家庭の電気の不具合を報告するため。24時間対応。",
    co1_badge:"商店 · 中心部", co1_title:"メインストリートの商店", co1_detail:"Rafael Morandé周辺にいくつかの商店やミニマーケットがあります。水・スナック・観光客向けの基本品を販売。",
    co2_badge:"整備士 · 街道", co2_title:"整備士／自動車工場", co2_detail:"アクセス道路やメリピージャへの道沿いに小さな工場があります。重大な故障は最寄りがメリピージャ市内です。", co2_link:"📍 工場を探す",
    co3_badge:"燃料", co3_title:"ガソリンスタンド", co3_detail:"最寄りのガソリンスタンドはメリピージャ方面の道沿いです。サンティアゴから来る場合は満タンで来ることをおすすめします。",
    co4_badge:"ATM · 現金", co4_title:"ATM", co4_detail:"村内のRoberto Bravo 445にATMがあります。多くの店がカードに対応しています。",
    co5_badge:"郵便／荷物", co5_title:"Correos Chile", co5_detail:"最寄りの郵便局はメリピージャ市内です。発送はそこから手配してください。",
    co6_badge:"観光案内", co6_title:"地域案内ポイント", co6_detail:"メイン入口に観光案内標識があります。職人や店主は観光客をよく案内してくれます。", co6_detail2:"ポマイレの広場に観光案内ポイントがあります。",
    pl1_badge:"広場 · 中心部", pl1_title:"ポマイレ中央広場", pl1_detail:"中央広場は村の中心です。工芸品店や飲食店に囲まれています。休憩や方向確認に最適。",
    pl2_badge:"教会", pl2_detail:"村の歴史的な教会。建築上の目印。",
    pl3_badge:"王国会館", pl3_detail:"公共の精神的な場。時間：木曜 19:00 - 21:15、土曜 19:00 - 20:45。",
    pl4_badge:"設備", pl4_title:"公衆トイレ", pl4_detail:"中央広場の近くや一部の飲食店にトイレがあります。ハイシーズンは行列になることがあります。",
    al1_badge:"工芸 · メインストリート", al1_title:"陶工の通り", al1_detail:"Rafael Morandéはメインストリートで、職人が実演・販売する工房や店でいっぱいです。粘土の作品：水差し、鍋、甕など。",
    al2_badge:"公開工房", al2_title:"陶工の作業を見る", al2_detail:"多くの職人がろくろや窯を見える所で使っています。生の粘土から完成品まで、全工程を見られます。",
    al3_badge:"購入のヒント", al3_title:"工芸品を責任を持って買う", al3_detail:"職人から直接買うのがおすすめです。強引な値切りは避けましょう — 各作品には手間と家族の伝統があります。",
    al4_badge:"遺産", al4_title:"チリの無形遺産", al4_detail:"ポマイレの陶芸は文化遺産として認められています。技術は何世紀も世代から世代へ受け継がれてきました。",
    al5_badge:"貯金箱", al5_title:"世界最大の陶器の貯金箱", al5_detail:"巨大な粘土の像がある博物館",
    dir_taller_h:"🎨 粘土の工房", dir_taller_sub:"ポマイレの職人と粘土の成形を学ぶ · <em>Pottery workshops</em>",
    dir_demo_h:"🌀 ろくろの実演", dir_demo_sub:"巨匠が粘土を形作る様子を生で見る · <em>Pottery wheel demonstrations</em>",
    dir_arte_h:"🏺 粘土の店と職人", dir_arte_sub:"職人から直接購入。ポマイレの陶工の完全リスト · <em>Pottery shops &amp; artisans</em>",
    ga1_badge:"看板料理", ga1_title:"土鍋のカスエラ", ga1_detail:"ポマイレで最も象徴的な料理。カスエラ、エンパナーダ、pastel de chocloが村で作られた粘土の器で提供されます。",
    ga2_badge:"定番", ga2_title:"巨大エンパナーダ", ga2_detail:"ポマイレは大きなエンパナーダで有名です。メインストリート沿いにエンパナーダの店が並びます。",
    ga3_badge:"飲み物", ga3_title:"チチャと伝統的な飲み物", ga3_detail:"リンゴとぶどうのチチャ、mote con huesillo、手作りの飲み物。地元料理によく合います。",
    ga4_badge:"食事処", ga4_title:"レストランと食堂", ga4_detail:"メインストリートと脇道に多数のレストラン。週末は待ち時間が出ることがあります。正午前の来店がおすすめです。", ga4_link:"📍 レストランを探す",
    dir_rest_h:"🍴 レストラン一覧", dir_rest_sub:"住所・電話・営業日付きのポマイレのレストラン · <em>Restaurants directory</em>",
    lodging_note:"💡 泊まれば、観光バスの混雑なしでポマイレを楽しみ、夜の村を体験できます。",
    dir_jardin_h:"🌱 園芸と苗木店", dir_jardin_sub:"植物、花、そして緑のひと休み · <em>Gardening &amp; plants</em>",
    dir_serv_h:"📌 主要スポットとサービス", dir_serv_sub:"訪問中に役立つ場所 · <em>Key points &amp; services</em>",
    ar1_badge:"農村部 · 近隣", ar1_detail:"ポマイレにとても近い農村。ぶどう畑と渓谷のある沿岸の乾燥地の風景。観光中心地から離れ、静けさと自然を求める人に最適。",
    ar2_badge:"農村ルート", ar2_title:"乾燥地の道とワイン", ar2_detail:"ポマイレ周辺は伝統的なワイン産地です。Los Chiñihues地区や近隣の道に、チチャやワインの小規模な家族経営の生産者がいます。",
    ar3_badge:"自然", ar3_title:"丘と渓谷", ar3_detail:"ポマイレを囲む丘からはメリピージャの谷を望めます。村とLos Chiñihuesを結ぶ道からアクセスできる非公式の小道があります。",
    ar4_badge:"アクセス", ar4_title:"サンティアゴからの行き方", ar4_detail:"Autopista del Sol（ルート78）をメリピージャ方面へ。51km地点でポマイレ方面の標識のある出口へ。サンティアゴから車で約50分。",
    ar5_badge:"公共交通", ar5_title:"サンティアゴ／メリピージャからのバス", ar5_detail:"Terminal San Borja（サンティアゴ）からメリピージャ停車のバスがあります。メリピージャからポマイレ行きの農村ミニバスが定期的に出ています。", ar5_link:"📍 メリピージャ ターミナル",
    ar6_badge:"通信", ar6_title:"携帯電波とWiFi", ar6_detail:"ポマイレの携帯電波は中心部では問題ありませんが、Los Chiñihuesや農村部では弱い場合があります。一部のレストランはWiFiを提供しています。",
    wine_title:"ワインとチチャの道", wine_sub:"ポマイレとLos Chiñihuesの沿岸乾燥地、伝統的なぶどう畑の地 · <em>Wine &amp; chicha route</em>",
    wine_tag:"🍇 体験 · メリピージャ渓谷 · 沿岸乾燥地",
    wine_intro:"粘土だけでなく、ポマイレ周辺は<strong>伝統的なぶどう畑とぶどう棚の地</strong>です。沿岸の乾燥地と<strong>Los Chiñihues</strong>地区には、<strong>リンゴとぶどうのチチャ</strong>、ピペーニョ、農民のワインを何世代も受け継がれた技術で造る小さな家族経営の生産者が残っています。陶工の村の田舎で祝祭的な一面を発見する道です。",
    wine_c1_t:"País品種", wine_c1_d:"チリの乾燥地の伝統的なぶどうで、農民のワインやピペーニョの基礎。国内最古の品種の一つで、この地域の素朴なぶどう棚で栽培されます。",
    wine_c2_t:"手作りチチャ", wine_c2_d:"この地の象徴的な飲み物：リンゴとぶどうのチチャ、新鮮で甘い。伝統的なレストランで見られ、特に独立記念日の頃に豊富です。",
    wine_c3_t:"乾燥地のピペーニョ", wine_c3_d:"若く素朴な農民のワインで、カスエラや巨大エンパナーダによく合います。ポマイレ料理との完璧なペアリング。",
    wine_c4_t:"Los Chiñihues", wine_c4_d:"ポマイレから数分の農村部で、ぶどう畑、渓谷、静かな道が広がります。周辺の家族経営のワイン造りの伝統の中心。",
    wine_c5_t:"粘土でのペアリング", wine_c5_d:"チチャとワインは村で作られた粘土の水差しや器で提供され、ポマイレの二大伝統を一つの体験に結びつけます。",
    wine_c6_t:"ベストシーズン", wine_c6_d:"収穫期（3〜4月）と独立記念日（9月）は、新鮮なチチャ、実ったぶどう棚、乾燥地の祝祭的な雰囲気が最も多い時期です。",
    wine_steps_h:"🧭 ルートの巡り方",
    wine_s1_t:"ポマイレ中心部から出発", wine_s1_d:"Roberto Bravo通りとSan Antonio通りの伝統的なレストランで、リンゴまたはぶどうのチチャを味わいましょう。",
    wine_s2_t:"Los Chiñihuesへ向かう", wine_s2_d:"乾燥地の農村の道を車で進み、ぶどう棚と渓谷の間を抜けます。満タンで：電波が弱くサービスも少ないです。",
    wine_s3_t:"家族経営の生産者を探す", wine_s3_d:"村で季節のチチャや手作りワインを尋ねましょう。多くは地区の家や露店で直接販売されています。",
    wine_s4_t:"グルメで締めくくる", wine_s4_d:"村に戻り、見つけた一品を粘土の器で提供されるカスエラやエンパナーダと合わせましょう。乾杯！",
    wine_cta_t:"🍷 この地域でぶどう畑やぶどう棚をお持ち、またはチチャを造っていますか？ あなたの場所をこのルートに加えてガイドに掲載しましょう。", wine_cta_btn:"🗺️ Los Chiñihuesを見る",
    wine_note:"メリピージャの沿岸乾燥地のワイン造りの伝統に基づくルート。生産者と時間は季節によって変わります。村でお確かめください。適量を · 18歳以上限定。",
    or_title:"ポマイレ公式観光ルート", or_src:"観光局による推奨行程 · メリピージャ市 · <em>Official tourist route</em>",
    or_badge1:"🚶 徒歩：約35分", or_badge2:"🚗 車：約19分", or_badge3:"📅 サンティアゴから日帰り",
    or_st1_t:"サンティアゴ出発", or_st1_d:"陶工の村への旅の始まり。",
    or_st2_t:"ポマイレ到着", or_st2_d:"ポマイレ広場の観光案内所（OIT）でお出迎え。",
    or_st3_t:"Imperio Pomaireで朝食", or_st3_d:"Roberto Bravo 78 · 一日を始める典型的なチリの味。",
    or_st4_t:"Granja Alfareraで粘土工房", or_st4_d:"Bernardo O'Higgins 260 · 没入体験：ろくろから窯まで。",
    or_st5_t:"Restaurant La Gredaで昼食", or_st5_d:"30年以上の歴史を持つチリの家庭料理とグリル。",
    or_st6_t:"Vivero Luchín訪問", or_st6_d:"San Antonio 191 · 植物、花、鉢の間の緑のひと休み。",
    or_st7_t:"自由なショッピングの午後", or_st7_d:"Roberto Bravo通りの粘土の工房や店を巡りましょう。",
    or_st8_t:"サンティアゴへ帰還", or_st8_d:"手作りの思い出とともにツアー終了。",
    or_f1:"伝統料理へのRominaとFabioの努力から生まれました。7年後に2店舗目を開き、今ではポマイレの典型的な味の名店です。",
    or_f2:"粘土の技を守るための観光文化スペース。生の実演、ポマイレの職人によるワークショップ、採取から窯までの全工程の見学を提供します。",
    or_f3:"30年以上の伝統。Don Víctor Larraínは古い家族の日干しレンガの家を、世界最大のエンパナーダと三世代の家庭料理の発祥地である美食の名所に変えました。",
    or_f4:"田舎、植物、工芸を組み合わせた小さく魅力的な苗木店。工房やレストランを巡った後の静かな休憩に最適で、ポマイレの生きた思い出を持ち帰れます。",
    free_tour_label:"💡 自由散策 · 自分のペースで",
    filter_lodging:"宿泊", filter_highlight:"見る", route_oficial_name:"公式ルート", route_oficial_meta:"5か所 · 終日"
  },
  zh: {
    nav_lodging:"住宿", nav_seewhat:"看点",
    nav_g_essentials:"必备信息", nav_g_todo:"玩什么", nav_g_eatsleep:"吃与住", nav_g_plan:"行程规划", nav_winery:"葡萄酒之路", site_municipality:"市政府", site_official_map:"查看波迈雷官方地图",
    ev_m1:"1–2月", ev_m2:"6月", ev_m3:"9月", ev_m4:"11–12月", weather_loading:"⏳ 正在加载天气...", social_title:"关注我们的社媒", social_sub:"每天分享陶工小镇的照片、动态与生活。", social_ig:"在 Instagram 关注我们",
    a11y_title:"♿ 无障碍", a11y_font:"🔠 字体大小", a11y_read:"🔊 朗读", a11y_readall:"📖 全部朗读", a11y_hint:"开启朗读后，点按网站上的任意文字即可听到朗读。", a11y_hint_active:"✅ 朗读已开启：点按网站上的任意文字即可听到。", a11y_activate:"🔊 开启", a11y_stop:"⏹ 停止", a11y_unavailable:"🔇 不可用", a11y_size_normal:"标准大小", a11y_size:"大小", a11y_voice_on:"朗读已开启。点按任意文字即可听到。", a11y_no_support:"您的浏览器不支持朗读。", a11y_aria_options:"无障碍选项", a11y_aria_close:"关闭",
    s_lodging_title:"住宿", s_lodging_sub:"在波迈雷过夜的旅舍、小屋和套房 · <em>Where to stay</em>",
    s_interes_title:"看点与兴趣点", s_interes_sub:"景点、迷人的店铺和顺路体验 · <em>Highlights &amp; things to see</em>",
    lnk_map:"📍 在地图上查看", lnk_zone:"📍 查看区域", lnk_howto:"📍 如何前往",
    pk1_badge:"主要 · 北入口", pk1_title:"波迈雷入口停车场", pk1_detail:"Rafael Morandé街，正对主入口。镇上最大的停车场。周末可能在11:00前停满。",
    pk2_badge:"侧道 · 工匠街", pk2_title:"18 de Septiembre街停车场", pk2_detail:"18 de Septiembre街路边停车，紧邻老城区。北入口停满时的备选。",
    pk3_badge:"大巴与中巴", pk3_title:"旅游大巴区", pk3_detail:"为旅游大巴和面包车设置的区域。请向北入口的保安询问。",
    pk4_badge:"提示", pk4_title:"停车小贴士", pk4_detail:"周末在10:30前到达可避开拥堵。请勿堵塞居民出入口或乡村道路。",
    he1_badge:"CESFAM · 波迈雷", he1_detail:"Artesana Julita Vera 354, 波迈雷",
    he2_badge:"医院 · 梅利皮亚", he2_detail:"O'Higgins 551, 梅利皮亚 · 24小时急诊。波迈雷重症病例的主要就诊点（开车约15分钟）。",
    he3_badge:"急救 · 24小时", he3_title:"SAMU救护车 — 急救", he3_detail:"任何电话均可24小时免费拨打。用于事故、心梗和危及生命的紧急情况。", he3_link:"📞 拨打131",
    he4_badge:"药店 · 梅利皮亚", he4_title:"梅利皮亚的药店", he4_detail:"波迈雷有一家药店，地址San Antonio 140。值班药店每日轮换。", he4_link:"🔗 查看今日值班",
    emn_police:"警察（Carabineros）", emn_samu:"SAMU救护车", emn_fire:"消防", emn_peace:"治安", emn_vif:"家庭暴力 · 妇女", emn_power:"CGE停电",
    se1_badge:"警察 · 波迈雷", se1_title:"波迈雷警务站", se1_detail:"San Rafael 496街。Carabineros警察的本地服务点。", se_emer133:"📞 急救 133", se1_link2:"📞 网格计划急救 +56984289058",
    se2_badge:"消防 · 梅利皮亚", se2_title:"梅利皮亚消防中心", se2_detail:"负责波迈雷和乡村地区。遇火灾或救援请拨打132。", se_emer132:"📞 急救 132",
    se3_badge:"电力服务", se3_title:"CGE — 停电", se3_detail:"用于报告家庭电力故障。24小时可用。",
    co1_badge:"杂货店 · 中心", co1_title:"主街上的店铺", co1_detail:"Rafael Morandé及周边有多家杂货店和小超市。售卖水、零食和游客所需的基本物品。",
    co2_badge:"修理 · 公路", co2_title:"修理工／汽车修理厂", co2_detail:"进镇公路和前往梅利皮亚的路上有小型修理厂。重大故障最近的在梅利皮亚市区。", co2_link:"📍 寻找修理厂",
    co3_badge:"燃油", co3_title:"加油站", co3_detail:"最近的加油站在通往梅利皮亚的路上。如果从圣地亚哥来，建议加满油箱再出发。",
    co4_badge:"取款机 · 现金", co4_title:"自动取款机", co4_detail:"镇内Roberto Bravo 445街有一台取款机。许多店铺接受刷卡。",
    co5_badge:"邮政／包裹", co5_title:"Correos Chile", co5_detail:"最近的邮局在梅利皮亚市区。请从那里安排寄送。",
    co6_badge:"旅游信息", co6_title:"本地信息点", co6_detail:"主入口设有旅游指示牌。工匠和商户通常会为游客很好地指路。", co6_detail2:"波迈雷广场设有旅游信息点。",
    pl1_badge:"广场 · 中心", pl1_title:"波迈雷中心广场", pl1_detail:"中心广场是小镇的心脏。四周环绕工艺品店和餐饮店。适合休息和辨认方向。",
    pl2_badge:"教堂", pl2_detail:"小镇的历史教堂。建筑地标。",
    pl3_badge:"王国聚会所", pl3_detail:"公共精神场所。时间：周四 19:00 - 21:15。周六 19:00 - 20:45。",
    pl4_badge:"设施", pl4_title:"公共卫生间", pl4_detail:"中心广场附近和部分餐厅设有卫生间。旺季可能需要排队。",
    al1_badge:"工艺 · 主街", al1_title:"陶工之街", al1_detail:"Rafael Morandé是主街，遍布工匠现场制作和销售的工坊与店铺。陶土作品：水罐、炖锅、大缸等。",
    al2_badge:"开放工坊", al2_title:"观看陶工制作", al2_detail:"许多工匠当众使用陶轮和窑炉工作。可以看到完整过程：从生陶土到成品。",
    al3_badge:"购买建议", al3_title:"负责任地购买工艺品", al3_detail:"最好直接向工匠购买。请勿强行压价——每件作品背后都有劳动和家族传统。",
    al4_badge:"遗产", al4_title:"智利非物质遗产", al4_detail:"波迈雷的制陶被认定为文化遗产。技艺世代相传已有数个世纪。",
    al5_badge:"存钱罐", al5_title:"世界最大陶土存钱罐", al5_detail:"陈列巨型陶土造型的博物馆",
    dir_taller_h:"🎨 陶土工坊", dir_taller_sub:"跟波迈雷工匠学习陶土塑形 · <em>Pottery workshops</em>",
    dir_demo_h:"🌀 陶轮演示", dir_demo_sub:"现场观看大师塑造陶土 · <em>Pottery wheel demonstrations</em>",
    dir_arte_h:"🏺 陶土店铺与工匠", dir_arte_sub:"直接向工匠购买。波迈雷陶工完整名单 · <em>Pottery shops &amp; artisans</em>",
    ga1_badge:"招牌菜", ga1_title:"陶锅炖菜（cazuela）", ga1_detail:"波迈雷最具代表性的菜肴。Cazuela、empanada和pastel de choclo盛在本镇制作的陶器中上桌。",
    ga2_badge:"经典", ga2_title:"巨型empanada", ga2_detail:"波迈雷以其超大empanada闻名。主街沿线遍布empanada店铺。",
    ga3_badge:"饮品", ga3_title:"Chicha与传统饮品", ga3_detail:"苹果与葡萄chicha、mote con huesillo以及手工饮品。是搭配本地美食的绝佳之选。",
    ga4_badge:"哪里吃", ga4_title:"餐厅与小馆", ga4_detail:"主街及其支街有众多餐厅。周末可能需要等位。建议中午前到达。", ga4_link:"📍 寻找餐厅",
    dir_rest_h:"🍴 餐厅目录", dir_rest_sub:"含地址、电话和营业日的波迈雷餐厅 · <em>Restaurants directory</em>",
    lodging_note:"💡 住下来过夜可让你避开旅游大巴的人潮，体验夜晚的波迈雷。",
    dir_jardin_h:"🌱 园艺与苗圃", dir_jardin_sub:"植物、花卉与一片绿色的歇息 · <em>Gardening &amp; plants</em>",
    dir_serv_h:"📌 重点地点与服务", dir_serv_sub:"参观期间的实用地点 · <em>Key points &amp; services</em>",
    ar1_badge:"乡村区 · 附近", ar1_detail:"距波迈雷很近的乡村。沿海旱地景观，有葡萄园和沟壑。适合想远离旅游中心、寻求宁静与自然的人。",
    ar2_badge:"乡村路线", ar2_title:"旱地的道路与美酒", ar2_detail:"波迈雷周边是传统葡萄酒产区。Los Chiñihues地区及邻近道路有小型家庭式的chicha和葡萄酒生产者。",
    ar3_badge:"自然", ar3_title:"山丘与沟壑", ar3_detail:"环绕波迈雷的山丘可俯瞰梅利皮亚谷地。从连接小镇与Los Chiñihues的道路可进入一些非正式小径。",
    ar4_badge:"交通", ar4_title:"如何从圣地亚哥前往", ar4_detail:"走Autopista del Sol（78号公路）前往梅利皮亚。在51公里处有通往波迈雷的指示牌出口。从圣地亚哥开车约50分钟。",
    ar5_badge:"公共交通", ar5_title:"从圣地亚哥/梅利皮亚的巴士", ar5_detail:"有从Terminal San Borja（圣地亚哥）出发、在梅利皮亚停靠的巴士。从梅利皮亚有乡村中巴定期开往波迈雷。", ar5_link:"📍 梅利皮亚客运站",
    ar6_badge:"网络", ar6_title:"手机信号与WiFi", ar6_detail:"波迈雷市中心手机信号尚可，但在Los Chiñihues和乡村地区可能较弱。部分餐厅提供WiFi。",
    wine_title:"葡萄酒与Chicha之路", wine_sub:"波迈雷与Los Chiñihues的沿海旱地，传统葡萄园之乡 · <em>Wine &amp; chicha route</em>",
    wine_tag:"🍇 体验 · 梅利皮亚谷 · 沿海旱地",
    wine_intro:"除了陶土，波迈雷周边还是<strong>传统葡萄园与葡萄藤架之乡</strong>。在沿海旱地和<strong>Los Chiñihues</strong>地区，仍有小型家庭式生产者以世代相传的技艺酿造<strong>苹果与葡萄chicha</strong>、pipeño和乡村葡萄酒。这是一条发现陶工小镇乡村与节庆一面的路线。",
    wine_c1_t:"País葡萄", wine_c1_d:"智利旱地的传统葡萄，是乡村葡萄酒和pipeño的基础。是该国最古老的品种之一，种植在本地区简朴的藤架上。",
    wine_c2_t:"手工chicha", wine_c2_d:"当地标志性饮品：苹果与葡萄chicha，清新香甜。可在传统餐厅找到，尤其在国庆节前后非常丰富。",
    wine_c3_t:"旱地pipeño", wine_c3_d:"年轻而质朴的乡村葡萄酒，最适合搭配cazuela或巨型empanada。是波迈雷美食的完美搭配。",
    wine_c4_t:"Los Chiñihues", wine_c4_d:"距波迈雷几分钟的乡村区，有葡萄园、沟壑和宁静的道路。是周边家庭式葡萄酒传统的中心。",
    wine_c5_t:"陶器中的搭配", wine_c5_d:"chicha和葡萄酒盛在本镇制作的陶罐和陶器中，将波迈雷的两大传统融为一次体验。",
    wine_c6_t:"最佳季节", wine_c6_d:"采收季（3—4月）和国庆节（9月）是旱地新鲜chicha最多、藤架挂满、节庆气氛最浓的时节。",
    wine_steps_h:"🧭 如何游览这条路线",
    wine_s1_t:"从波迈雷市中心开始", wine_s1_d:"在Roberto Bravo街和San Antonio街的传统餐厅品尝苹果或葡萄chicha。",
    wine_s2_t:"前往Los Chiñihues", wine_s2_d:"开车走旱地的乡村道路，穿行于藤架与沟壑之间。请加满油箱：这里信号弱、服务少。",
    wine_s3_t:"寻找家庭式生产者", wine_s3_d:"在镇上打听当季的chicha和手工葡萄酒；许多在该地区的住家和摊位直接销售。",
    wine_s4_t:"以美食收尾", wine_s4_d:"返回小镇，用陶器盛装的cazuela或empanada搭配你的收获。干杯！",
    wine_cta_t:"🍷 你在本地区有葡萄园、藤架或酿造chicha吗？把你的地点加入这条路线，出现在指南中。", wine_cta_btn:"🗺️ 查看Los Chiñihues",
    wine_note:"本路线基于梅利皮亚沿海旱地的葡萄酒传统。生产者和营业时间随季节变化；请在镇上咨询。理性饮酒 · 仅限18岁以上。",
    or_title:"波迈雷官方旅游路线", or_src:"由旅游局建议的行程 · 梅利皮亚市政府 · <em>Official tourist route</em>",
    or_badge1:"🚶 步行：约35分钟", or_badge2:"🚗 开车：约19分钟", or_badge3:"📅 从圣地亚哥出发一日游",
    or_st1_t:"从圣地亚哥出发", or_st1_d:"前往陶工小镇旅程的开始。",
    or_st2_t:"抵达波迈雷", or_st2_d:"在波迈雷广场的旅游信息办公室（OIT）迎接。",
    or_st3_t:"在Imperio Pomaire吃早餐", or_st3_d:"Roberto Bravo 78 · 以典型的智利风味开启一天。",
    or_st4_t:"在Granja Alfarera体验陶土工坊", or_st4_d:"Bernardo O'Higgins 260 · 沉浸式体验：从陶轮到窑炉。",
    or_st5_t:"在Restaurant La Greda午餐", or_st5_d:"拥有30多年历史的智利家常菜与烤肉。",
    or_st6_t:"参观Vivero Luchín", or_st6_d:"San Antonio 191 · 在植物、花卉和花盆间享受一片绿色的歇息。",
    or_st7_t:"自由购物的下午", or_st7_d:"逛逛Roberto Bravo街的陶土工坊和店铺。",
    or_st8_t:"返回圣地亚哥", or_st8_d:"带着手工纪念品结束行程。",
    or_f1:"源于Romina和Fabio对传统料理的努力。七年后他们开了第二家店，如今已成为波迈雷典型风味的标杆。",
    or_f2:"致力于保护陶土技艺的旅游文化空间。提供现场演示、与波迈雷工匠的工作坊，以及从取土到烧窑全过程的参观。",
    or_f3:"30多年的传统。Don Víctor Larraín将古老的家族土坯房改造成美食标杆，是世界最大empanada和三代家常菜的发源地。",
    or_f4:"一个融合乡村、植物与手工的小巧迷人苗圃。适合在逛完工坊和餐厅后安静歇脚，并带走一份波迈雷的鲜活记忆。",
    free_tour_label:"💡 自由游览 · 按你的节奏探索",
    filter_lodging:"住宿", filter_highlight:"看点", route_oficial_name:"官方路线", route_oficial_meta:"5个站点 · 全天"
  }
};

// Fusionar las traducciones adicionales dentro de LANGS
Object.keys(LANG_EXTRA).forEach(function(l){
  if (LANGS[l]) Object.assign(LANGS[l], LANG_EXTRA[l]);
});

/* ══ BADGES DE VALOR DEL HERO (multiidioma) ══ */
const HERO_STATS_I18N = {
  es: { hs_heritage:"Tradición alfarera centenaria", hs_distance:"A 50 min de Santiago", hs_artisans:"Artesanos trabajando en vivo", hs_food:"Empanadas gigantes" },
  en: { hs_heritage:"Centuries-old pottery tradition", hs_distance:"50 min from Santiago", hs_artisans:"Artisans working live", hs_food:"Giant empanadas" },
  pt: { hs_heritage:"Tradição oleira centenária", hs_distance:"A 50 min de Santiago", hs_artisans:"Artesãos trabalhando ao vivo", hs_food:"Empanadas gigantes" },
  fr: { hs_heritage:"Tradition potière centenaire", hs_distance:"À 50 min de Santiago", hs_artisans:"Artisans au travail en direct", hs_food:"Empanadas géantes" },
  ru: { hs_heritage:"Вековая гончарная традиция", hs_distance:"50 минут от Сантьяго", hs_artisans:"Гончары за работой вживую", hs_food:"Гигантские эмпанадас" },
  ja: { hs_heritage:"何世紀も続く陶芸の伝統", hs_distance:"サンティアゴから50分", hs_artisans:"職人の実演が見られる", hs_food:"巨大エンパナーダ" },
  zh: { hs_heritage:"百年制陶传统", hs_distance:"距圣地亚哥50分钟", hs_artisans:"现场制作的工匠", hs_food:"巨型肉馅饼" }
};
Object.keys(HERO_STATS_I18N).forEach(function(l){
  if (LANGS[l]) Object.assign(LANGS[l], HERO_STATS_I18N[l]);
});

const KEYS = {
  '[data-t="nav_park"]':      t => t.nav_park,
  '[data-t="nav_health"]':    t => t.nav_health,
  '[data-t="nav_security"]':  t => t.nav_security,
  '[data-t="nav_commerce"]':  t => t.nav_commerce,
  '[data-t="nav_pottery"]':   t => t.nav_pottery,
  '[data-t="nav_food"]':      t => t.nav_food,
  '[data-t="nav_around"]':    t => t.nav_around,
  '[data-t="nav_plaza"]':     t => t.nav_plaza,
  '[data-t="nav_map"]':       t => t.nav_map,
  '[data-t="nav_donate"]':    t => t.nav_donate,
  '[data-t="hero_tag"]':      t => t.hero_tag,
  '[data-t="hero_h1"]':       t => t.hero_h1,
  '[data-t="hero_sub"]':      t => t.hero_sub,
  '[data-t="emer_police"]':   t => t.emer_police,
  '[data-t="emer_samu"]':     t => t.emer_samu,
  '[data-t="emer_fire"]':     t => t.emer_fire,
  '[data-t="emer_peace"]':    t => t.emer_peace,
  '[data-t="s_park_title"]':  t => t.s_park_title,
  '[data-t="s_park_sub"]':    t => t.s_park_sub,
  '[data-t="s_health_title"]':t => t.s_health_title,
  '[data-t="s_health_sub"]':  t => t.s_health_sub,
  '[data-t="s_sec_title"]':   t => t.s_sec_title,
  '[data-t="s_sec_sub"]':     t => t.s_sec_sub,
  '[data-t="s_com_title"]':   t => t.s_com_title,
  '[data-t="s_com_sub"]':     t => t.s_com_sub,
  '[data-t="s_pot_title"]':   t => t.s_pot_title,
  '[data-t="s_pot_sub"]':     t => t.s_pot_sub,
  '[data-t="s_gas_title"]':   t => t.s_gas_title,
  '[data-t="s_gas_sub"]':     t => t.s_gas_sub,
  '[data-t="s_aro_title"]':   t => t.s_aro_title,
  '[data-t="s_aro_sub"]':     t => t.s_aro_sub,
  '[data-t="s_pla_title"]':   t => t.s_pla_title,
  '[data-t="s_pla_sub"]':     t => t.s_pla_sub,
  '[data-t="s_map_title"]':   t => t.s_map_title,
  '[data-t="s_map_sub"]':     t => t.s_map_sub,
  '[data-t="s_don_title"]':   t => t.s_don_title,
  '[data-t="s_don_sub"]':     t => t.s_don_sub,
  '[data-t="donate_text"]':   t => t.donate_text,
  '[data-t="donate_btn"]':    t => t.donate_btn,
  '[data-t="donate_note"]':   t => t.donate_note,
  '[data-t="emer_numbers"]':  t => t.emer_numbers,
  '[data-t="footer_tagline"]':t => t.footer_tagline,
  '[data-t="footer_emer"]':   t => t.footer_emer,
  '[data-t="footer_disc"]':   t => t.footer_disc,
  '[data-t="footer_date"]':   t => t.footer_date,

  '[data-t="nav_weather"]':   t => t.nav_weather,
  '[data-t="nav_tour"]':      t => t.nav_tour,
  '[data-t="nav_gallery"]':   t => t.nav_gallery,
  '[data-t="nav_events"]':    t => t.nav_events,
  '[data-t="nav_reviews"]':   t => t.nav_reviews,

  '[data-t="s_weather_title"]': t => t.s_weather_title,
  '[data-t="s_weather_sub"]':   t => t.s_weather_sub,
  '[data-t="weather_note"]':    t => t.weather_note,

  '[data-t="s_tour_title"]': t => t.s_tour_title,
  '[data-t="s_tour_sub"]':   t => t.s_tour_sub,
  '[data-t="tour_1_title"]': t => t.tour_1_title, '[data-t="tour_1_desc"]': t => t.tour_1_desc,
  '[data-t="tour_2_title"]': t => t.tour_2_title, '[data-t="tour_2_desc"]': t => t.tour_2_desc,
  '[data-t="tour_3_title"]': t => t.tour_3_title, '[data-t="tour_3_desc"]': t => t.tour_3_desc,
  '[data-t="tour_4_title"]': t => t.tour_4_title, '[data-t="tour_4_desc"]': t => t.tour_4_desc,
  '[data-t="tour_5_title"]': t => t.tour_5_title, '[data-t="tour_5_desc"]': t => t.tour_5_desc,
  '[data-t="tour_6_title"]': t => t.tour_6_title, '[data-t="tour_6_desc"]': t => t.tour_6_desc,
  '[data-t="tour_7_title"]': t => t.tour_7_title, '[data-t="tour_7_desc"]': t => t.tour_7_desc,

  '[data-t="s_gallery_title"]': t => t.s_gallery_title,
  '[data-t="s_gallery_sub"]':   t => t.s_gallery_sub,
  '[data-t="gallery_note"]':    t => t.gallery_note,

  '[data-t="s_events_title"]': t => t.s_events_title,
  '[data-t="s_events_sub"]':   t => t.s_events_sub,
  '[data-t="ev_1_title"]': t => t.ev_1_title, '[data-t="ev_1_desc"]': t => t.ev_1_desc,
  '[data-t="ev_2_title"]': t => t.ev_2_title, '[data-t="ev_2_desc"]': t => t.ev_2_desc,
  '[data-t="ev_3_title"]': t => t.ev_3_title, '[data-t="ev_3_desc"]': t => t.ev_3_desc,
  '[data-t="ev_4_title"]': t => t.ev_4_title, '[data-t="ev_4_desc"]': t => t.ev_4_desc,
  '[data-t="ev_tag_busy"]': t => t.ev_tag_busy, '[data-t="ev_tag_fest"]': t => t.ev_tag_fest,
  '[data-t="ev_tag_nat"]':  t => t.ev_tag_nat,  '[data-t="ev_tag_xmas"]': t => t.ev_tag_xmas,

  '[data-t="s_reviews_title"]': t => t.s_reviews_title,
  '[data-t="s_reviews_sub"]':   t => t.s_reviews_sub,
  '[data-t="rev_1_text"]': t => t.rev_1_text, '[data-t="rev_1_name"]': t => t.rev_1_name, '[data-t="rev_1_origin"]': t => t.rev_1_origin,
  '[data-t="rev_2_text"]': t => t.rev_2_text, '[data-t="rev_2_name"]': t => t.rev_2_name, '[data-t="rev_2_origin"]': t => t.rev_2_origin,
  '[data-t="rev_3_text"]': t => t.rev_3_text, '[data-t="rev_3_name"]': t => t.rev_3_name, '[data-t="rev_3_origin"]': t => t.rev_3_origin,
  '[data-t="rev_4_text"]': t => t.rev_4_text, '[data-t="rev_4_name"]': t => t.rev_4_name, '[data-t="rev_4_origin"]': t => t.rev_4_origin,
  '[data-t="review_form_title"]': t => t.review_form_title,
  '[data-t="review_btn"]':        t => t.review_btn,

  '[data-t="filter_all"]': t => t.filter_all,
  '[data-t="filter_parking"]': t => t.filter_parking,
  '[data-t="filter_health"]': t => t.filter_health,
  '[data-t="filter_security"]': t => t.filter_security,
  '[data-t="filter_pottery"]': t => t.filter_pottery,
  '[data-t="filter_food"]': t => t.filter_food,
  '[data-t="filter_services"]': t => t.filter_services,
  '[data-t="filter_around"]': t => t.filter_around,
  '[data-t="locate_btn"]': t => t.locate_btn,
  '[data-t="map_hint"]': t => t.map_hint,
  '[data-t="routes_title"]': t => t.routes_title,
  '[data-t="route_artisan_name"]': t => t.route_artisan_name,
  '[data-t="route_artisan_meta"]': t => t.route_artisan_meta,
  '[data-t="route_family_name"]': t => t.route_family_name,
  '[data-t="route_family_meta"]': t => t.route_family_meta,
  '[data-t="route_food_name"]': t => t.route_food_name,
  '[data-t="route_food_meta"]': t => t.route_food_meta,
  '[data-t="route_nature_name"]': t => t.route_nature_name,
  '[data-t="route_nature_meta"]': t => t.route_nature_meta,
  '[data-t="route_clear"]': t => t.route_clear,
};

function applyLang(lang) {
  const t = LANGS[lang];
  if (!t) return;
  currentLang = lang;
  document.documentElement.lang = lang;
  const base = LANGS.es;
  const val = (k) => (t[k] !== undefined ? t[k] : base[k]);
  // Texto traducible (cualquier elemento con data-t)
  document.querySelectorAll('[data-t]').forEach(el => {
    const v = val(el.dataset.t);
    if (v !== undefined) el.innerHTML = v;
  });
  // Placeholders de formularios
  document.querySelectorAll('[data-ph-t]').forEach(el => {
    const v = val(el.dataset.phT);
    if (v !== undefined) el.setAttribute('placeholder', v);
  });
  // Subtítulos / captions (galería)
  document.querySelectorAll('[data-caption-t]').forEach(el => {
    const v = val(el.dataset.captionT);
    const span = el.querySelector('span');
    if (span && v !== undefined) span.textContent = v;
  });
  // highlight active button
  document.querySelectorAll('.lang-option').forEach(b => {
    b.classList.toggle('lang-active', b.dataset.lang === lang);
  });
  const labels = {
    es:['🇨🇱','Español'], en:['🇬🇧','English'], pt:['🇧🇷','Português'],
    fr:['🇫🇷','Français'], ru:['🇷🇺','Русский'], ja:['🇯🇵','日本語'], zh:['🇨🇳','中文']
  };
  if (labels[lang]) {
    document.getElementById('langCurrentFlag').textContent = labels[lang][0];
    document.getElementById('langCurrentName').textContent = labels[lang][1];
  }
  // Re-renderizar widgets dinámicos en el idioma actual
  if (typeof window.translateContent === 'function') window.translateContent(lang);
  if (typeof window.localizeWeather === 'function') window.localizeWeather();
  if (typeof window.refreshA11y === 'function') window.refreshA11y();
  // Enlace flotante de WhatsApp (mensaje traducido)
  const wa = document.getElementById('waShare');
  if (wa) {
    const msg = val('wa_share');
    if (msg) wa.href = 'https://wa.me/?text=' + encodeURIComponent(msg);
    const waLabel = val('wa_aria');
    if (waLabel) wa.setAttribute('aria-label', waLabel);
  }
  // persist
  try { localStorage.setItem('p360lang', lang); } catch(e){}
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = (() => { try { return localStorage.getItem('p360lang'); } catch(e){ return null; } })();
  const browser = (navigator.language || 'es').slice(0,2);
  const auto = saved || (['es','en','pt','fr','ru','ja','zh'].includes(browser) ? browser : 'es');
  applyLang(auto);
});

/* ===== */

// ── WEATHER ─────────────────────────────────────────────────────────────────
async function loadWeather() {
  const box = document.getElementById('weather-widget');
  try {
    const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-33.642&longitude=-71.145&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America/Santiago&forecast_days=3');
    const d = await r.json();
    const c = d.current;
    const icons = {0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',71:'❄️',73:'❄️',75:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',95:'⛈️',96:'⛈️',99:'⛈️'};
    const descs = {0:'Cielo despejado',1:'Mayormente despejado',2:'Parcialmente nublado',3:'Nublado',45:'Niebla',48:'Niebla',51:'Llovizna leve',53:'Llovizna',55:'Llovizna intensa',61:'Lluvia leve',63:'Lluvia moderada',65:'Lluvia intensa',71:'Nieve leve',73:'Nieve',75:'Nieve intensa',80:'Chubascos',81:'Chubascos',82:'Chubascos fuertes',95:'Tormenta',96:'Tormenta',99:'Tormenta'};
    const icon = icons[c.weather_code] || '🌡️';
    const desc = descs[c.weather_code] || 'Variable';

    // Pronóstico de 3 días
    let forecast = '';
    if (d.daily && d.daily.time) {
      const dayNames = ['dom','lun','mar','mié','jue','vie','sáb'];
      let cards = '';
      for (let i = 0; i < Math.min(3, d.daily.time.length); i++) {
        const dt = new Date(d.daily.time[i] + 'T12:00:00');
        const label = i === 0 ? 'Hoy' : dayNames[dt.getDay()];
        const ic = icons[d.daily.weather_code[i]] || '🌡️';
        const mx = Math.round(d.daily.temperature_2m_max[i]);
        const mn = Math.round(d.daily.temperature_2m_min[i]);
        cards += `<div class="wf-day"><div class="wf-name">${label}</div><div class="wf-ico">${ic}</div><div class="wf-temp"><strong>${mx}°</strong> <span>${mn}°</span></div></div>`;
      }
      forecast = `<div class="weather-forecast">${cards}</div>`;
    }

    box.innerHTML = `
      <div class="weather-main">
        <span class="weather-icon">${icon}</span>
        <div>
          <div class="weather-temp">${Math.round(c.temperature_2m)}°C</div>
          <div class="weather-desc">${desc} · Sensación ${Math.round(c.apparent_temperature)}°C</div>
        </div>
      </div>
      <div class="weather-stat"><div class="ws-val">${c.relative_humidity_2m}%</div><div class="ws-lab">Humedad</div></div>
      <div class="weather-stat"><div class="ws-val">${Math.round(c.wind_speed_10m)} km/h</div><div class="ws-lab">Viento</div></div>
      <div class="weather-stat"><div class="ws-val">${Math.round(c.apparent_temperature)}°C</div><div class="ws-lab">Sensación</div></div>
      ${forecast}
    `;
  } catch(e) {
    box.innerHTML = '<div class="weather-loading">No se pudo cargar el clima. Verifica tu conexión.</div>';
  }
}
loadWeather();

// ── STAR PICKER ──────────────────────────────────────────────────────────────
let selectedStars = 5;
document.addEventListener('DOMContentLoaded', () => {
  const stars = document.querySelectorAll('#star-picker span');
  stars.forEach(s => {
    s.addEventListener('click', () => {
      selectedStars = parseInt(s.dataset.val);
      stars.forEach(x => x.classList.toggle('active', parseInt(x.dataset.val) <= selectedStars));
    });
    s.addEventListener('mouseover', () => {
      stars.forEach(x => x.classList.toggle('active', parseInt(x.dataset.val) <= parseInt(s.dataset.val)));
    });
  });
  document.getElementById('star-picker').addEventListener('mouseleave', () => {
    stars.forEach(x => x.classList.toggle('active', parseInt(x.dataset.val) <= selectedStars));
  });
  // init 5 stars
  stars.forEach(x => x.classList.toggle('active', parseInt(x.dataset.val) <= 5));
  loadUserReviews();
});

// ── REVIEWS ──────────────────────────────────────────────────────────────────
function submitReview() {
  const name   = document.getElementById('rev-name').value.trim();
  const origin = document.getElementById('rev-origin').value.trim();
  const text   = document.getElementById('rev-text').value.trim();
  if (!name || !text) { alert('Por favor ingresa tu nombre y comentario.'); return; }
  const reviews = getReviews();
  reviews.unshift({ name, origin, text, stars: selectedStars, date: new Date().toLocaleDateString('es-CL') });
  try { localStorage.setItem('p360reviews', JSON.stringify(reviews.slice(0,20))); } catch(e){}
  document.getElementById('rev-name').value = '';
  document.getElementById('rev-origin').value = '';
  document.getElementById('rev-text').value = '';
  loadUserReviews();
}

function getReviews() {
  try { return JSON.parse(localStorage.getItem('p360reviews') || '[]'); } catch(e){ return []; }
}

function loadUserReviews() {
  const list = document.getElementById('reviews-user');
  const reviews = getReviews();
  if (!reviews.length) { list.innerHTML = ''; return; }
  list.innerHTML = reviews.map(r => `
    <div class="user-review-item">
      <strong>${r.name}${r.origin ? ' · ' + r.origin : ''}</strong>
      <span style="color:#F5A623;margin-left:.4rem">${'★'.repeat(r.stars)}</span>
      <span style="color:var(--muted);font-size:.75rem;margin-left:.4rem">${r.date}</span>
      <p style="margin-top:.3rem">${r.text}</p>
    </div>
  `).join('');
}

/* ===== */

function toggleLangMenu(e) {
  e.stopPropagation();
  const sel = document.getElementById('langSelector');
  const btn = document.getElementById('langToggleBtn');
  const isOpen = sel.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen);
}
function selectLang(lang) {
  applyLang(lang);
  document.getElementById('langSelector').classList.remove('open');
  document.getElementById('langToggleBtn').setAttribute('aria-expanded', 'false');
}
document.addEventListener('click', () => {
  const sel = document.getElementById('langSelector');
  if (sel) {
    sel.classList.remove('open');
    document.getElementById('langToggleBtn').setAttribute('aria-expanded','false');
  }
});

// ── NAV DROPDOWN MENUS ───────────────────────────────────────────────────
function closeAllGroups() {
  document.querySelectorAll('.nav-group.open').forEach(g => {
    g.classList.remove('open');
    const b = g.querySelector('.nav-group-btn');
    if (b) b.setAttribute('aria-expanded', 'false');
  });
}
function toggleGroup(e, btn) {
  e.stopPropagation();
  const group = btn.parentElement;
  const wasOpen = group.classList.contains('open');
  closeAllGroups();
  if (!wasOpen) {
    group.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}
function toggleNav(e) {
  e.stopPropagation();
  const wrap = document.getElementById('navGroups');
  const burger = document.getElementById('navBurger');
  const open = wrap.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  if (!open) closeAllGroups();
}
// Close groups when clicking outside; close mobile nav + groups when a link is chosen
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-group')) closeAllGroups();
});
document.addEventListener('DOMContentLoaded', () => {
  function closeMobileNav() {
    closeAllGroups();
    const wrap = document.getElementById('navGroups');
    const burger = document.getElementById('navBurger');
    if (wrap && wrap.classList.contains('open')) {
      wrap.classList.remove('open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    }
  }
  // Cerrar el menú móvil al elegir cualquier opción (incluye botones Mapa y Apoyar)
  document.querySelectorAll('.nav-menu a, .nav-cta, .nav-map-btn').forEach(a => {
    a.addEventListener('click', closeMobileNav);
  });
  // Cerrar el menú móvil al hacer scroll (subir o bajar)
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const wrap = document.getElementById('navGroups');
    if (wrap && wrap.classList.contains('open') && Math.abs(window.scrollY - lastY) > 10) {
      closeMobileNav();
    }
    lastY = window.scrollY;
  }, { passive: true });
});

/* ===== */

// ══════════════════════════════════════════════════════════════════════════
// MAPA INTERACTIVO — Pomaire 360
// ══════════════════════════════════════════════════════════════════════════

const PLACES = [
  // ── PARKING ──
  { id:'pk1', cat:'parking', icon:'🅿️', lat:-33.653240612009675, lng:-71.1484175855184, name:'Estacionamiento Entrada Pomaire', desc:'Rafael Morandé · acceso principal', addr:'Rafael Morandé, Pomaire', gmap:'https://maps.app.goo.gl/q4opxzkj7DVq5Z8U6' },
  { id:'pk2', cat:'parking', icon:'🚗', lat:-33.65027186391058, lng:-71.15430268749077, name:'Futuros Estacionamiento y baños públicos', desc:'Guillermo Barros con Diego de Almagro', addr:'Guillermo Barros con Diego de Almagro, Pomaire', gmap:'https://www.google.com/maps/search/?api=1&query=-33.65027186391058,-71.15430268749077' },
  { id:'pk3', cat:'parking', icon:'🚌', lat:-33.65078, lng:-71.14907, name:'Zona 18 de Septiembre', desc:'Lateral al casco principal', addr:'18 de Septiembre, Pomaire' },
  // ── HEALTH ──
  { id:'he1', cat:'health', icon:'🏥', lat:-33.6497, lng:-71.15053, name:'CESFAM Alfarera Rosa Reyes Vilches', desc:'Artesana Julita Vera 354', addr:'Julita Vera 354, Pomaire' },
  { id:'he2', cat:'health', icon:'💊', lat:-33.653491296625084, lng:-71.15118860753486, name:'Farmacia Acua-Naser Pomaire', desc:'San Antonio 362', addr:'San Antonio 362, Pomaire', gmap:'https://maps.app.goo.gl/c4QqqSLASBynLttk6' },
  // ── SECURITY ──
  { id:'se1', cat:'security', icon:'🚔', lat:-33.650798492760984, lng:-71.1512808846173, name:'Carabineros Policia', desc:'San Antonio 361', addr:'San Antonio 361, Pomaire', gmap:'https://maps.app.goo.gl/c555fkuX9t6jcMZs7' },
  { id:'se2', cat:'security', icon:'🚒', lat:-33.64977969139366, lng:-71.15086677981947, name:'Bomberos de Pomaire', desc:'San Antonio 362', addr:'San Antonio 362, Pomaire', gmap:'https://maps.app.goo.gl/MaJDFK4cwLwf9VZz5' },
  // ── SERVICES ──
  { id:'sv1', cat:'services', icon:'ℹ️', lat:-33.65033, lng:-71.15093, name:'Plaza de Pomaire · OIT', desc:'Oficina de Información Turística · punto de encuentro', addr:'Plaza de Pomaire, San Antonio 140' },
  { id:'sv2', cat:'services', icon:'⛪', lat:-33.646214708973325, lng:-71.15097954893574, name:'Iglesia de Pomaire', desc:'Templo histórico del pueblo', addr:'Iglesia de Pomaire' },
  { id:'sv3', cat:'services', icon:'🏧', lat:-33.65029994302147, lng:-71.1496768882763, name:'Cajero Automático (ATM)', desc:'Roberto Bravo 445', addr:'Roberto Bravo 445, Pomaire', gmap:'https://maps.app.goo.gl/HcGUyYo8DQq94NBj9' },
  { id:'sv4', cat:'services', icon:'🏫', lat:-33.6500313951976, lng:-71.15053295001364, name:'Colegio de Pomaire', desc:'Colegio y Jardín · Enseñanza Básica', addr:'Pomaire', gmap:'https://maps.app.goo.gl/3JLo3RHEu7yPhsMw6', ig:'colegiopomaire_' },
  { id:'sv5', cat:'services', icon:'✝️', lat:-33.6563274403623, lng:-71.15040862537278, name:'El Cristo', desc:'Roberto Bravo 1', addr:'Roberto Bravo 1, Pomaire', gmap:'https://maps.app.goo.gl/Y6MUWpDbiqaSCjUz9' },
  { id:'sv6', cat:'services', icon:'⚽', lat:-33.65447017901263, lng:-71.15242874012448, name:'Cancha de Pomaire', desc:'Cam. La Cruz, Pomaire', addr:'Cam. La Cruz, Pomaire, Melipilla', gmap:'https://www.google.com/maps/search/?api=1&query=-33.65447017901263,-71.15242874012448' },
  { id:'sv7', cat:'services', icon:'🏛️', lat:-33.65266285604718, lng:-71.15463474076532, name:'Templo Salón del Reino · Testigos de Jehová', desc:'Salón del Reino de los Testigos de Jehová', addr:'Pomaire, Melipilla', gmap:'https://maps.app.goo.gl/q2WCFmKxVuEp5Ggn7' },
  // ── POTTERY ──
  { id:'po1', cat:'pottery', icon:'🏺', lat:-33.65119135971276, lng:-71.15284938597316, name:'Granja Educativa Alfarera', desc:'Talleres de greda · Bernardo O\'Higgins 260', addr:'Bernardo O\'Higgins 260, Pomaire', gmap:'https://maps.app.goo.gl/Vgm2CgChUHYWCSg47' },
  { id:'po2', cat:'pottery', icon:'🎨', lat:-33.65176286310916, lng:-71.15033526947308, name:'Espacio Greda', desc:'Taller de greda · Arturo Prat 352', addr:'Arturo Prat 352, Pomaire', gmap:'https://maps.app.goo.gl/KbNfbMZKQpyjkFwk8', ig:'espaciogreda.cl', fb:'https://www.facebook.com/EspacioGreda/', plan:'destacado' },
  { id:'po3', cat:'pottery', icon:'🎨', lat:-33.652051018925114, lng:-71.14908723334928, name:'Taller del Sol', desc:'Taller de greda · Arturo Prat 237 B', addr:'Arturo Prat 237, Pomaire', gmap:'https://maps.app.goo.gl/9sp8oEZ3oQpxwDwu7' },
  { id:'po4', cat:'pottery', icon:'🎨', lat:-33.65435030691243, lng:-71.15447074355414, name:'Taller Barros', desc:'Taller de greda · Guillermo Barros 150', addr:'Guillermo Barros 150, Pomaire', gmap:'https://maps.app.goo.gl/Mpo926U8kMj5Rvog6' },
  { id:'po5', cat:'pottery', icon:'🏺', lat:-33.6522, lng:-71.15, name:'Calle de los Alfareros', desc:'Roberto Bravo · talleres y tiendas', addr:'Roberto Bravo, Pomaire' },
  { id:'po6', cat:'pottery', icon:'🐷', lat:-33.652552962128134, lng:-71.1534523252861, name:'El Chancho alcancia de greda más grande del mundo', desc:'Figura gigante de greda · Los Paltos 323', addr:'Los Paltos 323, Pomaire' },
  // ── FOOD ──
  { id:'fo1', cat:'food', icon:'☕', lat:-33.65460729825698, lng:-71.15001597751701, name:'Imperio Pomaire', desc:'Desayunos y cocina típica · Roberto Bravo 78', addr:'Roberto Bravo 78, Pomaire', gmap:'https://maps.app.goo.gl/muAoduKWg9frboTy7' },
  { id:'fo2', cat:'food', icon:'🥘', lat:-33.65317799731006, lng:-71.14994054878586, name:'Restaurant La Greda', desc:'Cocina criolla · 30+ años · Manuel Rodríguez', addr:'Manuel Rodríguez 251, Pomaire', gmap:'https://maps.app.goo.gl/SsdjchMYiy3K6eZeA' },
  { id:'fo3', cat:'food', icon:'🍽️', lat:-33.655708576989326, lng:-71.15010831317134, name:'Restaurante Los Naranjos', desc:'Roberto Bravo 29', addr:'Roberto Bravo 29, Pomaire', gmap:'https://maps.app.goo.gl/r3L9McHKqche7NTV7' },
  { id:'fo4', cat:'food', icon:'🍖', lat:-33.6515220531864, lng:-71.14978770847507, name:'La Casa del Costillar', desc:'Roberto Bravo 324', addr:'Roberto Bravo 324, Pomaire', gmap:'https://maps.app.goo.gl/wK2GRAiMgSrh8XaM9' },
  { id:'fo5', cat:'food', icon:'🍽️', lat:-33.65600068412172, lng:-71.15083197607485, name:'El Boliche de Pomaire', desc:'San Antonio 17', addr:'San Antonio 17, Pomaire', gmap:'https://maps.app.goo.gl/BNSQEnYq7sKi7dQE7' },
  { id:'fo6', cat:'food', icon:'🍽️', lat:-33.65314424375147, lng:-71.15047939144097, name:'La Normita — Tenedor libre', desc:'Manuel Rodríguez 325', addr:'Manuel Rodríguez 325, Pomaire', gmap:'https://maps.app.goo.gl/7bK3t8Bw9wyV73qw6' },
  { id:'fo7', cat:'food', icon:'🍖', lat:-33.65178030571566, lng:-71.14900454933903, name:'Restaurant El Parrón de Pomaire', desc:'Parrilla · Arturo Prat 210', addr:'Arturo Prat 210, Pomaire', gmap:'https://maps.app.goo.gl/k5VjUyrJFg8koTB2A' },
  { id:'fo8', cat:'food', icon:'🍽️', lat:-33.654255535020724, lng:-71.1496627003142, name:'La Pica de la Mireya', desc:'Roto Chileno 249', addr:'Roto Chileno 249, Pomaire', gmap:'https://maps.app.goo.gl/NrvTa1aNHBCpd1cX8' },
  { id:'fo9', cat:'food', icon:'🍽️', lat:-33.65165080014213, lng:-71.14996004940937, name:'Restaurante La Cañada', desc:'Roberto Bravo 307', addr:'Roberto Bravo 307, Pomaire', gmap:'https://maps.app.goo.gl/FQvXzcwckKkUEpSt5' },
  { id:'fo10', cat:'food', icon:'🍬', lat:-33.651957, lng:-71.149992, name:'Dulcería Heladería Dulcepo', desc:'Dulces, postres y helados', addr:'Pomaire', gmap:'https://maps.app.goo.gl/JJJJmuB2tGdpF6tu7', ig:'dulcepo.cl', wsp:'56933925873' },
  { id:'fo11', cat:'food', icon:'🍽️', lat:-33.65435582442494, lng:-71.150266197532, name:'Restaurante San Pedro - Pomaire', desc:'Roto Chileno 332', addr:'Roto Chileno 332, Pomaire', gmap:'https://maps.app.goo.gl/UM7eCtd4QQAMXpwK7' },
  // ── LODGING ──
  { id:'lo1', cat:'lodging', icon:'🛏️', lat:-33.65198924949971, lng:-71.15296875422749, name:'Hostal Pomaire', desc:'Bernardo O\'Higgins 219', addr:'Bernardo O\'Higgins 219, Pomaire', gmap:'https://maps.app.goo.gl/x98TVQ53oSQwUmNX6' },
  { id:'lo2', cat:'lodging', icon:'🏡', lat:-33.64978985059087, lng:-71.15138707552667, name:'La Quinta de la Plaza', desc:'San Antonio 410', addr:'San Antonio 410, Pomaire', gmap:'https://maps.app.goo.gl/YBcasr5ChiRt6etNA', wsp:'56999598919', web:'https://laquintadelaplaza-cl.webnode.cl/' },
  { id:'lo3', cat:'lodging', icon:'🏕️', lat:-33.64827253156989, lng:-71.15605889381351, name:'Cabañas Glamen 1', desc:'Roberto Bravo 284', addr:'Roberto Bravo 284, Pomaire', gmap:'https://maps.app.goo.gl/gAN7Hg36i716RHet9', web:'https://hostaldelcentro.cl/' },
  { id:'lo4', cat:'lodging', icon:'🏕️', lat:-33.647366520043605, lng:-71.15680309312565, name:'Cabañas Glamen 2', desc:'Cabañas · alojamiento', addr:'Pomaire', gmap:'https://maps.app.goo.gl/r3KcbQDNxX9DhY7E7', web:'https://hostaldelcentro.cl/' },
  { id:'lo5', cat:'lodging', icon:'🛏️', lat:-33.65136884009364, lng:-71.15274217075873, name:'Pomaire Lodge & Suites', desc:'Bernardo O\'Higgins 219', addr:'Bernardo O\'Higgins 219, Pomaire', gmap:'https://maps.app.goo.gl/56MaGEtivjNeZrDr8', ig:'pomairesuites' },
  // ── HIGHLIGHT ──
  { id:'hl1', cat:'highlight', icon:'🍺', lat:-33.65165740947676, lng:-71.14995842541745, name:'Cervecería Pomaire', desc:'Cerveza artesanal | Shop & botellas · Roberto Bravo 307', addr:'Roberto Bravo 307, Pomaire', gmap:'https://maps.app.goo.gl/EN1vfiMMvNPJrueU7', ig:'cerveceriapomaire_', plan:'premium' },
  { id:'hl2', cat:'highlight', icon:'🛍️', lat:-33.65478707835062, lng:-71.15025443200825, name:'Tienda Calafate Austral', desc:'Tienda con encanto · Roberto Bravo 77B', addr:'Roberto Bravo 77, Pomaire', gmap:'https://maps.app.goo.gl/2rxHFCHtfKKTJ7wx6', ig:'calafateaustral.cl' },
  { id:'hl3', cat:'highlight', icon:'🧀', lat:-33.65192, lng:-71.1499, name:'Charcutería Don Mati', desc:'Arturo Prat 237', addr:'Arturo Prat 237, Pomaire' },
  { id:'hl4', cat:'highlight', icon:'🍦', lat:-33.651768302417416, lng:-71.14981400869864, name:'Panadería y Heladería ALSA', desc:'Roberto Bravo 1606', addr:'Roberto Bravo 1606, Pomaire', gmap:'https://maps.app.goo.gl/m6g2m7SAkA74wqGR9' },
  { id:'hl5', cat:'highlight', icon:'🏺', lat:-33.6475116, lng:-71.1503954, name:'Los Ceramistas', desc:'General Baquedano 350', addr:'General Baquedano 350, Pomaire', gmap:'https://maps.app.goo.gl/Hae5UCCkPmBnMSHPA' },
  { id:'hl6', cat:'highlight', icon:'🌿', lat:-33.653664329289256, lng:-71.15135912053388, name:'Vivero Luchín', desc:'Jardín y vivero · San Antonio 191', addr:'San Antonio 191, Pomaire', gmap:'https://maps.app.goo.gl/QXyw95D16H72fiTH9', ig:'viveroluchin' },
  // ── AROUND ──
  { id:'ar1', cat:'around', icon:'🌾', lat:-33.665, lng:-71.17, name:'Los Chiñihues', desc:'Paisaje rural, viñedos y quebradas', addr:'Los Chiñihues, Melipilla' },
];

const ROUTES = {
  oficial: { ids: ['sv1','fo1','po1','fo2','hl6'], color:'#8C3D16' },
  artisan: { ids: ['pk1','po5','po2','po3','po1'], color:'#B85C2C' },
  family:  { ids: ['sv1','po6','po1','fo2'], color:'#4A7C59' },
  food:    { ids: ['fo3','fo1','fo4','fo2'], color:'#D4622A' },
  nature:  { ids: ['sv1','hl6','ar1'], color:'#6B8E5A' }
};

let leafletMap, userMarker, userLatLng = null, routeLine = null;
const markers = {};
let activeCategory = 'all';
let activeRoute = null;

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function fmtDist(km) {
  if (km < 1) return `${Math.round(km*1000)} m`;
  return `${km.toFixed(1)} km`;
}
function fmtWalkTime(km) {
  const mins = Math.round((km / 4.5) * 60); // walking speed ~4.5km/h
  if (mins < 1) return '<1 min';
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins/60)}h ${mins%60}min`;
}

// Official illustrated map lightbox
function openOfficialMap() {
  const lb = document.getElementById('officialMapLightbox');
  if (lb) { lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeOfficialMap(e) {
  if (e && e.target.closest && e.target.closest('.map-lightbox-inner') && !e.target.closest('.map-lightbox-close')) return;
  const lb = document.getElementById('officialMapLightbox');
  if (lb) { lb.classList.remove('open'); document.body.style.overflow = ''; }
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOfficialMap(); });

function initMap() {
  leafletMap = L.map('leafletMap', { zoomControl: true }).setView([-33.6512, -71.1505], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19
  }).addTo(leafletMap);

  PLACES.forEach(p => {
    const featured = p.plan === 'destacado' || p.plan === 'premium';
    const bg = featured ? '#E6B246' : '#B85C2C';
    const sz = featured ? 42 : 34;
    const shadow = featured
      ? 'box-shadow:0 0 0 3px rgba(230,178,70,.5),0 3px 10px rgba(0,0,0,.4);'
      : 'box-shadow:0 2px 8px rgba(0,0,0,.3);';
    const marker = L.marker([p.lat, p.lng], {
      zIndexOffset: featured ? 1000 : 0,
      icon: L.divIcon({
        className: 'custom-marker' + (featured ? ' is-featured' : ''),
        html: `<div style="background:${bg};border:2px solid #fff;border-radius:50%;width:${sz}px;height:${sz}px;display:flex;align-items:center;justify-content:center;font-size:${featured ? 19 : 16}px;${shadow}">${p.icon}</div>`,
        iconSize: [sz, sz],
        iconAnchor: [sz / 2, sz / 2]
      })
    });
    marker.bindPopup(buildPopup(p));
    marker.addTo(leafletMap);
    marker.placeId = p.id;
    markers[p.id] = marker;
  });

  // Deep links: al abrir un marcador, reflejar el lugar en la URL (#lugar=ID)
  leafletMap.on('popupopen', (e) => {
    const id = e.popup && e.popup._source && e.popup._source.placeId;
    if (id) { try { history.replaceState(null, '', '#lugar=' + id); } catch (_) {} }
  });
  leafletMap.on('popupclose', () => {
    if (location.hash.indexOf('#lugar=') === 0) {
      try { history.replaceState(null, '', location.pathname + location.search); } catch (_) {}
    }
  });

  // Click on map = manual start point
  leafletMap.on('click', (e) => {
    if (e.originalEvent.target.closest('.leaflet-marker-icon')) return;
    setUserLocation(e.latlng.lat, e.latlng.lng, false);
  });

  renderPlacesList();
  openPlaceFromHash();
}

// Abre el marcador indicado en la URL (#lugar=ID), p.ej. al compartir un enlace
function openPlaceFromHash() {
  const m = location.hash.match(/^#lugar=([\w-]+)/);
  if (m && markers[m[1]]) {
    setTimeout(() => focusPlace(m[1]), 350);
  }
}
window.addEventListener('hashchange', openPlaceFromHash);

// Copia al portapapeles el enlace directo a un lugar del mapa
function copyPlaceLink(ev, id) {
  if (ev) ev.preventDefault();
  const url = location.origin + location.pathname + '#lugar=' + id;
  try { history.replaceState(null, '', '#lugar=' + id); } catch (_) {}
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(function () {
      if (ev && ev.target) ev.target.textContent = '✅ Enlace copiado';
    }).catch(function () {});
  }
}
window.copyPlaceLink = copyPlaceLink;

function buildPopup(p, distKm) {
  const distHtml = distKm !== undefined
    ? `<div class="popup-dist">📍 ${fmtDist(distKm)} · 🚶 ${fmtWalkTime(distKm)}</div>`
    : '';
  const badge = (p.plan === 'destacado' || p.plan === 'premium')
    ? `<span class="popup-badge badge-${p.plan}">${p.plan === 'premium' ? '💎' : '⭐'} ${planLabel(p.plan)}</span>`
    : '';
  const gmaps = p.gmap
    ? p.gmap
    : (p.addr
        ? `https://maps.google.com/?q=${encodeURIComponent(p.addr)}`
        : `https://maps.google.com/?q=${p.lat},${p.lng}`);
  const contacts = [];
  if (p.ig)  contacts.push(`<a href="https://instagram.com/${p.ig}" target="_blank" rel="noopener">📷 Instagram</a>`);
  if (p.wsp) contacts.push(`<a href="https://wa.me/${p.wsp}" target="_blank" rel="noopener">💬 WhatsApp</a>`);
  if (p.web) contacts.push(`<a href="${p.web}" target="_blank" rel="noopener">🌐 Web</a>`);
  if (p.fb)  contacts.push(`<a href="${p.fb}" target="_blank" rel="noopener">📘 Facebook</a>`);
  const contactHtml = contacts.length ? `<div class="popup-contacts">${contacts.join(' · ')}</div>` : '';
  return `<div class="map-popup"><strong>${p.icon} ${p.name}</strong>${badge ? '<div class="popup-badge-row">' + badge + '</div>' : ''}<p>${p.desc}</p>${distHtml}${contactHtml}<a href="${gmaps}" target="_blank">Abrir en Google Maps →</a><a href="#lugar=${p.id}" class="popup-share" onclick="copyPlaceLink(event,'${p.id}');return false;">🔗 Copiar enlace</a></div>`;
}

function setUserLocation(lat, lng, fromGPS) {
  userLatLng = { lat, lng };
  if (userMarker) leafletMap.removeLayer(userMarker);
  userMarker = L.marker([lat, lng], {
    icon: L.divIcon({
      className: 'user-marker',
      html: `<div style="background:#2563eb;border:3px solid #fff;border-radius:50%;width:20px;height:20px;box-shadow:0 0 0 6px rgba(37,99,235,.25);"></div>`,
      iconSize: [20,20],
      iconAnchor: [10,10]
    })
  }).addTo(leafletMap);

  const hint = document.getElementById('mapHint');
  hint.textContent = fromGPS
    ? '✅ Usando tu ubicación GPS — distancias actualizadas'
    : '✅ Punto de partida fijado — distancias actualizadas';

  updateDistances();
  renderPlacesList();
}

function locateUser() {
  const btn = document.getElementById('locateBtn');
  if (!navigator.geolocation) {
    alert('Tu navegador no soporta geolocalización. Haz clic en el mapa para fijar tu punto de partida manualmente.');
    return;
  }
  btn.textContent = '📡 Buscando...';
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setUserLocation(pos.coords.latitude, pos.coords.longitude, true);
      leafletMap.setView([pos.coords.latitude, pos.coords.longitude], 15);
      btn.innerHTML = '✅ <span data-t="locate_btn">Ubicación activa</span>';
      btn.classList.add('active');
    },
    (err) => {
      btn.innerHTML = '📍 <span data-t="locate_btn">Usar mi ubicación</span>';
      alert('No se pudo obtener tu ubicación. Puedes hacer clic en cualquier punto del mapa para fijar tu punto de partida manualmente.');
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

function updateDistances() {
  if (!userLatLng) return;
  PLACES.forEach(p => {
    const d = haversine(userLatLng.lat, userLatLng.lng, p.lat, p.lng);
    markers[p.id].setPopupContent(buildPopup(p, d));
  });
}

function renderPlacesList() {
  const list = document.getElementById('placesList');
  let filtered = activeCategory === 'all' ? PLACES : PLACES.filter(p => p.cat === activeCategory);

  let withDist = filtered.map(p => {
    const d = userLatLng ? haversine(userLatLng.lat, userLatLng.lng, p.lat, p.lng) : null;
    return { ...p, dist: d };
  });

  if (userLatLng) withDist.sort((a,b) => a.dist - b.dist);

  list.innerHTML = withDist.map(p => `
    <div class="place-row" onclick="focusPlace('${p.id}')">
      <span class="place-icon">${p.icon}</span>
      <div class="place-info">
        <div class="place-name">${p.name}</div>
        <div class="place-cat">${p.desc}</div>
      </div>
      ${p.dist !== null ? `<span class="place-dist">${fmtDist(p.dist)}</span>` : ''}
    </div>
  `).join('');
}

function focusPlace(id) {
  const p = PLACES.find(x => x.id === id);
  if (!p) return;
  leafletMap.setView([p.lat, p.lng], 17);
  markers[id].openPopup();
  document.getElementById('leafletMap').scrollIntoView({ behavior:'smooth', block:'center' });
}

// ── FILTERS ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.map-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;

      Object.entries(markers).forEach(([id, marker]) => {
        const place = PLACES.find(p => p.id === id);
        const visible = activeCategory === 'all' || place.cat === activeCategory;
        const el = marker.getElement();
        if (el) el.style.display = visible ? '' : 'none';
      });
      renderPlacesList();
    });
  });
});

// ── ROUTES ───────────────────────────────────────────────────────────────
function loadRoute(routeKey) {
  clearRoute(false);
  const route = ROUTES[routeKey];
  if (!route) return;

  document.querySelectorAll('.route-card').forEach(c => c.classList.remove('active'));
  document.querySelector(`[data-route="${routeKey}"]`).classList.add('active');
  activeRoute = routeKey;

  const latlngs = route.ids.map(id => {
    const p = PLACES.find(x => x.id === id);
    return [p.lat, p.lng];
  });

  routeLine = L.polyline(latlngs, { color: route.color, weight: 4, opacity: 0.75, dashArray: '8,6' }).addTo(leafletMap);

  // Highlight markers in route, dim others
  Object.entries(markers).forEach(([id, marker]) => {
    const el = marker.getElement();
    if (!el) return;
    el.style.opacity = route.ids.includes(id) ? '1' : '0.25';
  });

  leafletMap.fitBounds(routeLine.getBounds(), { padding: [40,40] });
  document.getElementById('routeClearBtn').style.display = 'inline-block';
}

function clearRoute(resetUI = true) {
  if (routeLine) { leafletMap.removeLayer(routeLine); routeLine = null; }
  Object.values(markers).forEach(m => { const el = m.getElement(); if (el) el.style.opacity = '1'; });
  if (resetUI) {
    document.querySelectorAll('.route-card').forEach(c => c.classList.remove('active'));
    document.getElementById('routeClearBtn').style.display = 'none';
    activeRoute = null;
  }
}

document.addEventListener('DOMContentLoaded', initMap);

/* ===== */

// ══════════════════════════════════════════════════════════════════════════
// DIRECTORIOS — datos oficiales (Mapa-Pomaire.pdf · Municipalidad de Melipilla)
// ══════════════════════════════════════════════════════════════════════════
const DIRECTORY = {
  restaurants: [
    { n:'Imperio Pomaire', a:'Roberto Bravo 78', p:'+56 9 73421189', d:'Lunes a domingo', map:'https://maps.app.goo.gl/muAoduKWg9frboTy7' },
    { n:'Restaurant La Greda', a:'Manuel Rodríguez 251', p:'', d:'30+ años · empanada más grande del mundo', map:'https://maps.app.goo.gl/SsdjchMYiy3K6eZeA' },
    { n:'Restaurante Los Naranjos', a:'Roberto Bravo 29', p:'+56 9 45606393', d:'Miércoles a domingo', map:'https://maps.app.goo.gl/r3L9McHKqche7NTV7' },
    { n:'La Cañada', a:'Roberto Bravo 307', p:'+56 9 76768309', d:'Sábado y domingo', map:'https://maps.app.goo.gl/FQvXzcwckKkUEpSt5' },
    { n:'La Pica del Artesano', a:'Roberto Bravo 114', p:'+56 9 92812141', d:'Lunes a domingo' },
    { n:'El Boliche de Pomaire', a:'San Antonio 17', p:'+56 9 32734479', d:'Lunes a domingo', map:'https://maps.app.goo.gl/BNSQEnYq7sKi7dQE7' },
    { n:'La Normita (Tenedor libre)', a:'Manuel Rodríguez 325', p:'+56 9 46609599', d:'Lunes a domingo', map:'https://maps.app.goo.gl/7bK3t8Bw9wyV73qw6' },
    { n:'Emporio Doña Tránsito', a:'San Antonio 321', p:'+56 9 54461130', d:'Sábado y domingo' },
    { n:'San Sebastián', a:'Roberto Bravo 50', p:'+56 9 90440988', d:'Lunes a domingo' },
    { n:'La Pica de la Mireya', a:'Roto Chileno 249', p:'+56 9 53387756', d:'Lunes a domingo', map:'https://maps.app.goo.gl/NrvTa1aNHBCpd1cX8' },
    { n:'El Nico', a:'Roberto Bravo 397', p:'+56 9 61629311', d:'Sábado y domingo' },
    { n:'Las Delicias de Patricia', a:'Manuel Rodríguez 321', p:'+56 9 59296110', d:'Miércoles a domingo' },
    { n:'San Antonio', a:'San Antonio 298', p:'+56 9 65707019', d:'Lunes a domingo' },
    { n:'Restaurant Chilper', a:'Camino La Cruz 454', p:'+56 9 76256505', d:'Lunes a domingo' },
    { n:'La Casa del Costillar', a:'Roberto Bravo 324', p:'+56 9 54153360', d:'Lunes a domingo', map:'https://maps.app.goo.gl/wK2GRAiMgSrh8XaM9' },
    { n:'El Rincón de las Brujas', a:'Roberto Bravo 302', p:'+56 9 35410406', d:'Lunes a domingo' },
    { n:'Quinta Los Naranjos', a:'San Antonio 279', p:'+56 9 59579197', d:'Sábado y domingo' },
    { n:'Flor y tierra', a:'Guillermo Barros 225', p:'+56 9 88291191', d:'Sábado y domingo' },
    { n:'Restaurant El Cototudo', a:'Roto Chileno 340', p:'+56 9 42419789', d:'Lunes a domingo' },
    { n:'La Coyita', a:'San Antonio 615', p:'+56 9 49772557', d:'Sábado y domingo', map:'https://maps.app.goo.gl/gRsBv17WXAjhq5mHA' },
    { n:'La Fuente de mi Tierra', a:'Roberto Bravo 49', p:'+56 9 84753494', d:'Lunes a domingo' },
    { n:'Restaurante San Pedro - Pomaire', a:'Roto Chileno 332', p:'+56 9 85285787', d:'Lunes a domingo', map:'https://maps.app.goo.gl/UM7eCtd4QQAMXpwK7' },
    { n:'El Ranchito de Amalia', a:'Manuel Rodríguez 204', p:'+56 9 91843195', d:'Lunes a domingo' },
    { n:'Los Secretos de Anita', a:'San Antonio 213', p:'+56 9 74906024', d:'Viernes a domingo' },
    { n:'Restaurant El Parrón de Pomaire', a:'Arturo Prat 210', p:'+56 9 52433979', d:'Lunes a domingo', map:'https://maps.app.goo.gl/k5VjUyrJFg8koTB2A' },
    { n:'Las Tinajas de Pomaire', a:'San Antonio 402', p:'+56 9 90177467', d:'Sábado y domingo' },
    { n:'Glamen', a:'Roberto Bravo 289', p:'+56 9 54109214', tag:'Cabañas Alojamiento', web:'https://hostaldelcentro.cl/' },
  ],
  talleres: [
    { n:'Granja Educativa Alfarera Greda', a:'Bernardo O\'Higgins 260', p:'+56 9 98793533', ig:'granjaalfarera', map:'https://maps.app.goo.gl/Vgm2CgChUHYWCSg47' },
    { n:'Espacio Greda', a:'Arturo Prat 352', p:'+56 9 20854538', ig:'espaciogreda.cl', fb:'https://www.facebook.com/EspacioGreda/', map:'https://maps.app.goo.gl/KbNfbMZKQpyjkFwk8', plan:'destacado', slug:'espacio-greda', hours:'Lun a Dom · 10:00–19:00', desc:'Taller de greda en Pomaire donde puedes ver y aprender el oficio alfarero tradicional, comprar piezas y conocer todo el proceso, desde el torno hasta el horno.' },
    { n:'Taller del Sol', a:'Arturo Prat 237 B', p:'+56 9 45203264', ig:'tallerdelsol_pomaire', map:'https://maps.app.goo.gl/9sp8oEZ3oQpxwDwu7' },
    { n:'Taller Barros', a:'Guillermo Barros 150', p:'+56 9 50432417', ig:'taller.barros.pomaire', map:'https://maps.app.goo.gl/Mpo926U8kMj5Rvog6' },
  ],
  demos: [
    { n:'Juan Pablo Muñoz', a:'Roberto Bravo 164', p:'+56 9 50821246', ig:'pablo.artesanodepomaire' },
    { n:'Pascual Gómez', a:'Arturo Prat 352', p:'+56 9 89075630' },
    { n:'Jorge Garrido', a:'Bernardo O\'Higgins 260', p:'+56 9 84144279' },
    { n:'El Pericote Artesanía', a:'Guillermo Barros 150', p:'+56 9 40869289', ig:'el.rinconcito.alfarero' },
  ],
  jardin: [
    { n:'Vivero Luchín', a:'San Antonio 191', p:'+56 9 54095760', ig:'viveroluchin', map:'https://maps.app.goo.gl/QXyw95D16H72fiTH9' },
    { n:'Jardín Monserrat', a:'El Carmen 389', p:'+56 9 91510810' },
  ],
  alojamientos: [
    { n:'Hostal Pomaire', a:'Bernardo O\'Higgins 219', p:'+56 9 48172678', ig:'hostalpomaire', map:'https://maps.app.goo.gl/x98TVQ53oSQwUmNX6' },
    { n:'Pomaire Lodge & Suites', a:'Bernardo O\'Higgins 219', p:'+56 9 65707019', ig:'pomairesuites', map:'https://maps.app.goo.gl/56MaGEtivjNeZrDr8' },
    { n:'La Quinta de la Plaza', a:'San Antonio 410', p:'+56 9 99598919', web:'https://laquintadelaplaza-cl.webnode.cl/', map:'https://maps.app.goo.gl/YBcasr5ChiRt6etNA' },
    { n:'Cabañas Glamen 1', a:'Roberto Bravo 284', p:'+56 9 54109214', web:'https://hostaldelcentro.cl/', map:'https://maps.app.goo.gl/gAN7Hg36i716RHet9' },
    { n:'Cabañas Glamen 2', a:'Pomaire', p:'+56 9 54109214', web:'https://hostaldelcentro.cl/', map:'https://maps.app.goo.gl/r3KcbQDNxX9DhY7E7' },
  ],
  interes: [
    { n:'El Chancho alcancia de greda más grande del mundo', a:'Los Paltos 323', p:'+56 9 36515838', tag:'Atractivo', map:'https://maps.app.goo.gl/rdCjzBBoP5XrtVuJ7' },
    { n:'Cervecería Pomaire', a:'Roberto Bravo 307', p:'+56 9 93979689', ig:'cerveceriapomaire_', tag:'Cerveza artesanal', map:'https://maps.app.goo.gl/EN1vfiMMvNPJrueU7', plan:'premium', slug:'cerveceria-pomaire', hours:'Vie a Dom · 12:00–21:00', desc:'Cerveza artesanal de Pomaire: shop y venta de botellas. Un espacio para disfrutar cerveza local hecha en el pueblo alfarero, ideal para acompañar la gastronomía típica.' },
    { n:'Tienda Calafate Austral', a:'Roberto Bravo 77B', p:'+56 9 36572068', ig:'calafateaustral.cl', tag:'Tienda', map:'https://maps.app.goo.gl/2rxHFCHtfKKTJ7wx6' },
    { n:'La Chakana', a:'Roberto Bravo 195', p:'+56 9 91162709', tag:'Tienda' },
    { n:'Charcutería Don Mati', a:'Arturo Prat 237', p:'+56 9 65852914', ig:'charcuteriadonmati', tag:'Charcutería' },
    { n:'Los Ceramistas', a:'General Baquedano 350', p:'+56 9 22579079', tag:'Cerámica' },
    { n:'Panadería y Heladería ALSA', a:'Roberto Bravo 1606', p:'', tag:'Panadería · Heladería', map:'https://maps.app.goo.gl/m6g2m7SAkA74wqGR9' },
    { n:'Cervecería / Chanchería Don Manuel', a:'Pasaje Juana Álvarez 107', p:'+56 9 42271014', tag:'Cecinas' },
    { n:'Artesanías Miriam (mimbre)', a:'San Antonio 180, local 3', p:'+56 9 94810090', tag:'Artesanía mimbre' },
    { n:'Tejidos de Punto', a:'San Antonio 180, local 4', p:'+56 9 96711139', tag:'Tejidos' },
    { n:'Vestuaristas Pomaire', a:'Galería La Loica, Roberto Bravo 324', p:'', ig:'vestuaristas', tag:'Vestuario' },
    { n:'El Místico (masajes, reiki)', a:'Roberto Bravo 27', p:'', tag:'Bienestar' },
    { n:'La Yerberita (farmacia natural)', a:'Roberto Bravo 1606', p:'', tag:'Bienestar' },
    { n:'Paseo Jardín de los Almendros', a:'Pomaire', p:'', tag:'Paseo' },
  ],
  servicios: [
    { n:'Oficina de Información Turística (OIT)', a:'Plaza de Pomaire', p:'+56 9 41814611', tag:'Turismo' },
    { n:'Plaza de Pomaire (punto de encuentro)', a:'San Antonio 140', p:'', tag:'9:30 a 20:30 hrs' },
    { n:'CESFAM Pomaire', a:'Artesana Julita Vera 354', p:'+56 2 28323466', tag:'Salud' },
    { n:'Carabineros Policia', a:'San Antonio 361', p:'133', tag:'Seguridad', map:'https://maps.app.goo.gl/c555fkuX9t6jcMZs7' },
    { n:'Bomberos', a:'San Antonio 362', p:'+56 2 29224430', tag:'Emergencia', map:'https://maps.app.goo.gl/MaJDFK4cwLwf9VZz5' },
    { n:'Farmacia Acua-Naser Pomaire', a:'San Antonio 362', p:'+56 2 29224430', tag:'Salud', map:'https://maps.app.goo.gl/c4QqqSLASBynLttk6' },
    { n:'Cajero Automático (ATM)', a:'Roberto Bravo 445', p:'', tag:'Dinero', map:'https://maps.app.goo.gl/HcGUyYo8DQq94NBj9' },
    { n:'Iglesia de Pomaire', a:'El Carmen 420', p:'', tag:'Templo' },
    { n:'Colegio de Pomaire', a:'Colegio y Jardín · Enseñanza Básica', p:'', ig:'colegiopomaire_', tag:'Educación', map:'https://maps.app.goo.gl/3JLo3RHEu7yPhsMw6' },
    { n:'El Cristo', a:'Roberto Bravo 1', p:'', tag:'Mirador', map:'https://maps.app.goo.gl/Y6MUWpDbiqaSCjUz9' },
    { n:'Futuros Estacionamiento y baños públicos', a:'Guillermo Barros con Diego de Almagro', p:'', tag:'Servicios', map:'https://www.google.com/maps/search/?api=1&query=-33.65027186391058,-71.15430268749077' },
  ],
  artesanos: [
    { n:'Camila y Diego', a:'Roberto Bravo 29', p:'+56 9 61277310' },
    { n:'Isolina Guzmán Araya', a:'Roberto Bravo 59', p:'+56 9 87667822' },
    { n:'Cerámicas Los Gemelos', a:'Roberto Bravo 455', p:'+56 9 62759986' },
    { n:'Juana García', a:'Manuel Rodríguez 347', p:'+56 9 92174717' },
    { n:'Familia Gatica Catalán', a:'Roberto Bravo 252, Galería Catalán Local 26', p:'+56 9 82814690' },
    { n:'Isabel R. & Eduardo G.', a:'Roberto Bravo esq. 18 de Septiembre', p:'+56 9 66055530' },
    { n:'Gredas Nene La Ruca', a:'Roberto Bravo 44B', p:'+56 9 88291191' },
    { n:'Cerámicas Valentina', a:'Roberto Bravo 88-A', p:'+56 9 73887858' },
    { n:'El Larita', a:'Roberto Bravo 465', p:'+56 9 97335365' },
    { n:'Pachamama Taller', a:'Arturo Prat 338 B', p:'+56 9 54042248' },
    { n:'Eduardo Pardo Z.', a:'Roberto Bravo 272', p:'+56 9 99498024' },
    { n:'Nano Santibáñez', a:'San Antonio 39', p:'+56 9 96212055' },
    { n:'Roberto Bravo', a:'Roberto Bravo 447', p:'+56 9 77750106' },
    { n:'Aracely', a:'General Baquedano esq. San Antonio', p:'+56 9 83342757' },
    { n:'Lámparas Irarrazaval Diseños', a:'Roberto Bravo 53 A', p:'+56 9 82851797' },
    { n:'Jesús Mi Alfarero', a:'Roberto Bravo 221', p:'+56 9 97568575' },
    { n:'Cerámica El Arbolito', a:'Roberto Bravo 510', p:'+56 9 93733512' },
    { n:'Taller Edi Art', a:'General Baquedano 316', p:'+56 9 79340584' },
    { n:'Miguel Salinas Baeza', a:'Roberto Bravo 13B', p:'+56 9 94560850' },
    { n:'La Raquelita', a:'Roberto Bravo 88', p:'+56 9 95169386' },
    { n:'Taller San José', a:'Roberto Bravo 460', p:'+56 9 82117144' },
    { n:'Cerámica y Decoración Inelia', a:'Arturo Prat 338', p:'+56 9 75182329' },
    { n:'San Marcos', a:'Roberto Bravo 267', p:'+56 9 53160316' },
    { n:'Segundo Enrique Trujillo S.', a:'San Antonio 10', p:'+56 9 85669982' },
    { n:'Rosa y Marcela', a:'Roberto Bravo 414', p:'+56 9 85039992' },
    { n:'Gredas Ximena', a:'San Antonio esq. Arturo Prat', p:'+56 9 96687585' },
    { n:'Cerámica Badi', a:'Roberto Bravo 49', p:'+56 9 87584538' },
    { n:'Cerámicas Fonola', a:'Roberto Bravo 185', p:'+56 9 92467532' },
    { n:'La Palmera', a:'Roberto Bravo 502', p:'+56 9 87854529' },
    { n:'Alfarería Edison', a:'General Baquedano 312', p:'+56 9 79340584' },
    { n:'Doña Laurita', a:'Roberto Bravo 407', p:'+56 9 61651455' },
    { n:'Gredas Flores', a:'San Antonio 335', p:'+56 9 51123005' },
    { n:'Cerámicas El Cheo', a:'Roberto Bravo 56 A', p:'+56 9 91661194' },
    { n:'Cerámicas Tania', a:'Roberto Bravo 454', p:'+56 9 62577048' },
    { n:'Enrique Garrido', a:'Manuel Rodríguez 345', p:'+56 9 73165446' },
    { n:'Artesanías Bernarda Hernández', a:'Roberto Bravo 248, Galería Serruchos', p:'+56 9 90225433' },
    { n:'Robertito', a:'Roberto Bravo esq. 18 de Septiembre', p:'+56 9 46497460' },
    { n:'Fresia Castillo Romero', a:'Roberto Bravo 13A', p:'+56 9 94511658' },
    { n:'Artesanía Tradicional El Gomero', a:'Roberto Bravo 80', p:'+56 9 91606574' },
    { n:'Rosa Mora', a:'Roberto Bravo 457', p:'+56 9 95580575' },
    { n:'Octavio Fernando Silva R.', a:'Manuel Rodríguez con San Antonio', p:'+56 9 31471192' },
    { n:'Mami Inés', a:'Roberto Bravo 252, Galería Catalán Local 1', p:'+56 9 83290566' },
    { n:'Artesanía Tradicional Loza de Greda', a:'Roberto Bravo con Morandé', p:'+56 9 98781143' },
    { n:'Gredas La Mamy', a:'Roberto Bravo 44C', p:'+56 9 97225185' },
    { n:'Cerámicas Miguel Ángel', a:'Roberto Bravo 97', p:'' },
    { n:'María Elisa Salinas Aguilera', a:'Roberto Bravo 469', p:'+56 9 92320964' },
    { n:'Donde Miguel', a:'Arturo Prat 380', p:'+56 9 92682046' },
    { n:'La Poza', a:'Roberto Bravo 311', p:'+56 9 93617561' },
    { n:'Artesanía Utilitaria El Cone', a:'San Antonio 215', p:'+56 9 84730313' },
    { n:'Mi Chanchita', a:'Roberto Bravo 453', p:'+56 9 96721752' },
    { n:'Cerámicas Rosa Ester', a:'Manuel Rodríguez 15', p:'+56 9 77751558' },
    { n:'Don Francisco', a:'Roberto Bravo 56 B', p:'+56 9 68089602' },
    { n:'Taller Tierra Arte', a:'Roberto Bravo 221', p:'+56 9 77877784' },
    { n:'María', a:'El Carmen 275', p:'+56 9 89909036' },
    { n:'Oscar Alejandro Durán', a:'El Carmen 690', p:'+56 9 83527207' },
    { n:'Marisol Quiróz Abarca', a:'Lautaro 752', p:'+56 9 99745542' },
    { n:'Fábrica Roca', a:'Roberto Bravo 114', p:'+56 9 99745542' },
    { n:'Cerámicas Dami', a:'El Carmen 479', p:'+56 9 68007192' },
    { n:'Cerámica Carolina', a:'El Limonal 722', p:'+56 9 71031885' },
    { n:'Amelia Rojas Quiróz', a:'Bernardo O\'Higgins 315', p:'+56 9 78316925' },
    { n:'Rosa Rojas', a:'General Baquedano 448', p:'+56 9 77877784' },
    { n:'Cerámicas Anaís', a:'El Carmen 329', p:'+56 9 67749664' },
    { n:'Elías Veliz', a:'Rafael Morandé 480 B', p:'+56 9 90325852' },
  ],
};

function telHref(p) {
  if (!p) return '';
  const first = p.split('/')[0];
  let digits = first.replace(/[^\d]/g, '');
  if (digits.length <= 4) return 'tel:' + digits;            // emergencias (133, etc.)
  if (!digits.startsWith('56')) digits = '56' + digits;
  return 'tel:+' + digits;
}

/* ── Traducción de etiquetas dinámicas de los directorios ── */
const DIR_MAP_LABEL = { es:'Mapa', en:'Map', pt:'Mapa', fr:'Carte', ru:'Карта', ja:'地図', zh:'地图' };
const DIR_TAGS = {
  'Lunes a domingo':{en:'Monday to Sunday',pt:'Segunda a domingo',fr:'Lundi au dimanche',ru:'Пн–Вс',ja:'月〜日',zh:'周一至周日'},
  'Miércoles a domingo':{en:'Wednesday to Sunday',pt:'Quarta a domingo',fr:'Mercredi au dimanche',ru:'Ср–Вс',ja:'水〜日',zh:'周三至周日'},
  'Sábado y domingo':{en:'Saturday and Sunday',pt:'Sábado e domingo',fr:'Samedi et dimanche',ru:'Сб и Вс',ja:'土・日',zh:'周六与周日'},
  'Viernes a domingo':{en:'Friday to Sunday',pt:'Sexta a domingo',fr:'Vendredi au dimanche',ru:'Пт–Вс',ja:'金〜日',zh:'周五至周日'},
  '30+ años · empanada más grande del mundo':{en:"30+ years · world's largest empanada",pt:'30+ anos · maior empanada do mundo',fr:'30+ ans · plus grande empanada du monde',ru:'30+ лет · самая большая эмпанада в мире',ja:'30年以上 · 世界最大のエンパナーダ',zh:'30多年 · 世界最大的empanada'},
  'Atractivo':{en:'Attraction',pt:'Atração',fr:'Attraction',ru:'Достопримечательность',ja:'名所',zh:'景点'},
  'Cerveza artesanal':{en:'Craft beer',pt:'Cerveja artesanal',fr:'Bière artisanale',ru:'Крафтовое пиво',ja:'クラフトビール',zh:'精酿啤酒'},
  'Tienda':{en:'Shop',pt:'Loja',fr:'Boutique',ru:'Магазин',ja:'店',zh:'商店'},
  'Charcutería':{en:'Charcuterie',pt:'Charcutaria',fr:'Charcuterie',ru:'Деликатесы',ja:'シャルキュトリ',zh:'熟食'},
  'Cerámica':{en:'Ceramics',pt:'Cerâmica',fr:'Céramique',ru:'Керамика',ja:'陶器',zh:'陶瓷'},
  'Heladería':{en:'Ice cream shop',pt:'Sorveteria',fr:'Glacier',ru:'Мороженое',ja:'アイスクリーム店',zh:'冰淇淋店'},
  'Cecinas':{en:'Cured meats',pt:'Embutidos',fr:'Charcuterie',ru:'Мясные деликатесы',ja:'加工肉',zh:'腌肉'},
  'Artesanía mimbre':{en:'Wicker crafts',pt:'Artesanato de vime',fr:'Artisanat en osier',ru:'Изделия из лозы',ja:'籐工芸',zh:'藤编工艺'},
  'Tejidos':{en:'Knitwear',pt:'Tecidos',fr:'Tricots',ru:'Вязаные изделия',ja:'編み物',zh:'针织品'},
  'Vestuario':{en:'Clothing',pt:'Vestuário',fr:'Vêtements',ru:'Одежда',ja:'衣料品',zh:'服饰'},
  'Bienestar':{en:'Wellness',pt:'Bem-estar',fr:'Bien-être',ru:'Велнес',ja:'ウェルネス',zh:'养生'},
  'Paseo':{en:'Stroll',pt:'Passeio',fr:'Promenade',ru:'Прогулка',ja:'散策',zh:'漫步'},
  'Turismo':{en:'Tourism',pt:'Turismo',fr:'Tourisme',ru:'Туризм',ja:'観光',zh:'旅游'},
  '9:30 a 20:30 hrs':{en:'9:30 to 20:30',pt:'9:30 às 20:30',fr:'9h30 à 20h30',ru:'9:30–20:30',ja:'9:30〜20:30',zh:'9:30至20:30'},
  'Salud':{en:'Health',pt:'Saúde',fr:'Santé',ru:'Здоровье',ja:'医療',zh:'医疗'},
  'Seguridad':{en:'Security',pt:'Segurança',fr:'Sécurité',ru:'Безопасность',ja:'治安',zh:'治安'},
  'Emergencia':{en:'Emergency',pt:'Emergência',fr:'Urgence',ru:'Экстренная служба',ja:'緊急',zh:'急救'},
  'Dinero':{en:'Money',pt:'Dinheiro',fr:'Argent',ru:'Деньги',ja:'現金',zh:'现金'},
  'Templo':{en:'Temple',pt:'Templo',fr:'Temple',ru:'Храм',ja:'寺院',zh:'教堂'},
  'Educación':{en:'Education',pt:'Educação',fr:'Éducation',ru:'Образование',ja:'教育',zh:'教育'},
  'Mirador':{en:'Viewpoint',pt:'Mirante',fr:'Belvédère',ru:'Смотровая площадка',ja:'展望台',zh:'观景点'},
  'Servicios':{en:'Services',pt:'Serviços',fr:'Services',ru:'Услуги',ja:'サービス',zh:'服务'}
};
function dirT(text) {
  if (!text) return text;
  if (currentLang === 'es') return text;
  const entry = DIR_TAGS[text];
  return (entry && entry[currentLang]) ? entry[currentLang] : text;
}

/* ── PLANES (monetización): destacado / premium ──────────────────────────── */
const PROFILES = {};
const PLAN_LABEL = {
  destacado: { es:'Destacado', en:'Featured', pt:'Destaque', fr:'En vedette', ru:'Рекомендуем', ja:'おすすめ', zh:'推荐' },
  premium:   { es:'Premium',   en:'Premium',  pt:'Premium',  fr:'Premium',    ru:'Премиум',    ja:'プレミアム', zh:'高级' }
};
const PROFILE_T = {
  see:   { es:'Ver perfil ▸', en:'View profile ▸', pt:'Ver perfil ▸', fr:'Voir le profil ▸', ru:'Профиль ▸', ja:'プロフィール ▸', zh:'查看资料 ▸' },
  hours: { es:'Horario', en:'Hours', pt:'Horário', fr:'Horaires', ru:'Часы', ja:'営業時間', zh:'营业时间' }
};
function planLabel(plan) { return (PLAN_LABEL[plan] && (PLAN_LABEL[plan][currentLang] || PLAN_LABEL[plan].es)) || ''; }
function profileT(k) { return (PROFILE_T[k] && (PROFILE_T[k][currentLang] || PROFILE_T[k].es)) || ''; }
function planBadge(plan) {
  if (!plan || !PLAN_LABEL[plan]) return '';
  const icon = plan === 'premium' ? '💎' : '⭐';
  return `<span class="dir-badge badge-${plan}">${icon} ${planLabel(plan)}</span>`;
}

function dirItemHTML(it) {
  if (it.plan && it.slug) PROFILES[it.slug] = it;
  const mapsUrl = it.map ? it.map : 'https://maps.google.com/?q=' + encodeURIComponent(it.a + ', Pomaire, Chile');
  const rawTag = it.tag || it.d;
  const tag = rawTag ? `<span class="dir-tag">${dirT(rawTag)}</span>` : '';
  const mapLabel = DIR_MAP_LABEL[currentLang] || DIR_MAP_LABEL.es;
  let links = `<a href="${mapsUrl}" target="_blank" rel="noopener">🗺️ ${mapLabel}</a>`;
  if (it.p) links += `<a href="${telHref(it.p)}">📞 ${it.p}</a>`;
  if (it.ig) links += `<a class="ig" href="https://instagram.com/${it.ig.replace(/^@/,'')}" target="_blank" rel="noopener">📷 @${it.ig.replace(/^@/,'')}</a>`;
  if (it.web) links += `<a href="${it.web}" target="_blank" rel="noopener">🌐 Web</a>`;
  if (it.fb) links += `<a href="${it.fb}" target="_blank" rel="noopener">📘 Facebook</a>`;
  const featured = it.plan === 'destacado' || it.plan === 'premium';
  const moreBtn = (featured && it.slug) ? `<button class="dir-more" onclick="openProfile('${it.slug}')">${profileT('see')}</button>` : '';
  return `<div class="dir-item${featured ? ' dir-featured plan-' + it.plan : ''}">
      <span class="dir-name">${it.n}</span>
      ${planBadge(it.plan)}
      ${tag}
      <span class="dir-addr">📍 ${it.a}</span>
      <div class="dir-links">${links}</div>
      ${moreBtn}
    </div>`;
}

function renderDir(containerId, list, countId) {
  const el = document.getElementById(containerId);
  // Orden: premium primero, luego destacado, luego gratis (estable dentro de cada grupo)
  const rank = (it) => it.plan === 'premium' ? 0 : (it.plan === 'destacado' ? 1 : 2);
  const ordered = list.map((it, i) => ({ it, i }))
    .sort((a, b) => (rank(a.it) - rank(b.it)) || (a.i - b.i))
    .map((x) => x.it);
  if (el) el.innerHTML = ordered.map(dirItemHTML).join('');
  if (countId) { const c = document.getElementById(countId); if (c) c.textContent = list.length; }
}

// Abre el perfil ampliado (modal) de un negocio destacado/premium
function openProfile(slug) {
  const it = PROFILES[slug];
  const modal = document.getElementById('profileModal');
  const body = document.getElementById('profileBody');
  if (!it || !modal || !body) return;
  const mapsUrl = it.map ? it.map : 'https://maps.google.com/?q=' + encodeURIComponent(it.a + ', Pomaire, Chile');
  const mapLabel = DIR_MAP_LABEL[currentLang] || DIR_MAP_LABEL.es;
  let links = `<a class="pf-link" href="${mapsUrl}" target="_blank" rel="noopener">🗺️ ${mapLabel}</a>`;
  if (it.p)  links += `<a class="pf-link" href="${telHref(it.p)}">📞 ${it.p}</a>`;
  if (it.wsp) links += `<a class="pf-link" href="https://wa.me/${it.wsp}" target="_blank" rel="noopener">💬 WhatsApp</a>`;
  if (it.ig) links += `<a class="pf-link" href="https://instagram.com/${it.ig.replace(/^@/,'')}" target="_blank" rel="noopener">📷 Instagram</a>`;
  if (it.web) links += `<a class="pf-link" href="${it.web}" target="_blank" rel="noopener">🌐 Web</a>`;
  if (it.fb) links += `<a class="pf-link" href="${it.fb}" target="_blank" rel="noopener">📘 Facebook</a>`;
  let gallery = '';
  if (it.photos && it.photos.length) {
    gallery = '<div class="pf-gallery">' + it.photos.map((u) => `<img src="${u}" alt="${it.n}" loading="lazy">`).join('') + '</div>';
  }
  body.innerHTML = `
    ${gallery}
    <div class="pf-head">${planBadge(it.plan)}<h3>${it.n}</h3></div>
    ${it.desc ? `<p class="pf-desc">${it.desc}</p>` : ''}
    <div class="pf-meta">
      <div>📍 ${it.a}</div>
      ${it.hours ? `<div>🕒 <strong>${profileT('hours')}:</strong> ${it.hours}</div>` : ''}
    </div>
    <div class="pf-links">${links}</div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeProfile() {
  const modal = document.getElementById('profileModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}
window.openProfile = openProfile;
window.closeProfile = closeProfile;

function renderAllDirs() {
  renderDir('restaurantDir', DIRECTORY.restaurants, 'restCount');
  renderDir('tallerDir',     DIRECTORY.talleres,    'tallerCount');
  renderDir('demoDir',       DIRECTORY.demos,       'demoCount');
  renderDir('artesanoDir',   DIRECTORY.artesanos,   'artesanoCount');
  renderDir('alojamientoDir',DIRECTORY.alojamientos);
  renderDir('interesDir',    DIRECTORY.interes);
  renderDir('jardinDir',     DIRECTORY.jardin,      'jardinCount');
  renderDir('servicioDir',   DIRECTORY.servicios,   'servicioCount');
}

// Permite a applyLang() re-renderizar los directorios en el idioma actual
window.translateContent = function(lang) { renderAllDirs(); };

document.addEventListener('DOMContentLoaded', renderAllDirs);

/* ===== */

// ══════════════════════════════════════════════════════════════════════════
// ACCESIBILIDAD — tamaño de letra + lectura en voz alta
// ══════════════════════════════════════════════════════════════════════════
const FONT_STEPS = [0.9, 1, 1.15, 1.3, 1.45, 1.6];
let fontIdx = 1;

// Helper de traducción para textos dinámicos del panel de accesibilidad
function a11yT(k){
  try {
    var L = (typeof LANGS !== 'undefined') ? (LANGS[currentLang] || LANGS.es) : null;
    if (L && L[k] !== undefined) return L[k];
    if (typeof LANGS !== 'undefined' && LANGS.es && LANGS.es[k] !== undefined) return LANGS.es[k];
  } catch(e){}
  return k;
}

function applyFont() {
  document.documentElement.style.setProperty('--fontScale', FONT_STEPS[fontIdx]);
  const pct = Math.round(FONT_STEPS[fontIdx] * 100);
  const lbl = document.getElementById('a11yScaleLabel');
  if (lbl) lbl.textContent = (fontIdx === 1 ? a11yT('a11y_size_normal') : a11yT('a11y_size')) + ' (' + pct + '%)';
  try { localStorage.setItem('p360font', fontIdx); } catch(e){}
}
function changeFont(dir) {
  fontIdx = Math.max(0, Math.min(FONT_STEPS.length - 1, fontIdx + dir));
  applyFont();
}
function resetFont() { fontIdx = 1; applyFont(); }

function toggleA11y(e) {
  if (e) e.stopPropagation();
  const p = document.getElementById('a11yPanel');
  const open = p.classList.toggle('open');
  document.getElementById('a11yToggle').setAttribute('aria-expanded', open);
}
document.addEventListener('click', (e) => {
  const p = document.getElementById('a11yPanel');
  if (p && p.classList.contains('open') && !e.target.closest('.a11y')) p.classList.remove('open');
});

// ── Lectura en voz alta (Web Speech API) ──────────────────────────────────
const speechOK = ('speechSynthesis' in window);
let readingMode = false;
let lastSpoken = null;

function speechLang() {
  const map = { es:'es-ES', en:'en-US', pt:'pt-BR', fr:'fr-FR', ru:'ru-RU', ja:'ja-JP', zh:'zh-CN' };
  return map[document.documentElement.lang] || 'es-ES';
}
function speak(text) {
  if (!speechOK || !text) return;
  text = text.replace(/\s+/g, ' ').trim();
  if (!text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = speechLang();
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}
function stopSpeak() {
  if (speechOK) window.speechSynthesis.cancel();
  if (lastSpoken) { lastSpoken.classList.remove('reading-highlight'); lastSpoken = null; }
}
function toggleReadMode() {
  if (!speechOK) { alert(a11yT('a11y_no_support')); return; }
  readingMode = !readingMode;
  const btn = document.getElementById('readToggleBtn');
  const hint = document.getElementById('a11yHint');
  document.body.classList.toggle('reading-mode', readingMode);
  if (readingMode) {
    btn.textContent = a11yT('a11y_stop');
    btn.classList.add('active');
    hint.textContent = a11yT('a11y_hint_active');
    speak(a11yT('a11y_voice_on'));
  } else {
    btn.textContent = a11yT('a11y_activate');
    btn.classList.remove('active');
    hint.textContent = a11yT('a11y_hint');
    stopSpeak();
  }
}

// Al tocar texto en modo lectura, leerlo en voz alta
document.addEventListener('click', (e) => {
  if (!readingMode) return;
  if (e.target.closest('.a11y')) return;          // no leer los propios controles
  const el = e.target.closest('p, h1, h2, h3, h4, li, span, a, strong, .card, .dir-item, .or-txt, .tour-content, .event-info, .review-card');
  if (!el) return;
  const txt = el.innerText || el.textContent;
  if (!txt || !txt.trim()) return;
  if (lastSpoken) lastSpoken.classList.remove('reading-highlight');
  el.classList.add('reading-highlight');
  lastSpoken = el;
  speak(txt);
}, true);

// Leer toda la página (secciones principales)
function readWholePage() {
  if (!speechOK) { alert(a11yT('a11y_no_support')); return; }
  const parts = [];
  document.querySelectorAll('h1, section h2, section h3, section p, .card h3, .card .card-detail').forEach(el => {
    if (el.offsetParent === null) return;          // omitir ocultos
    const t = (el.innerText || '').trim();
    if (t) parts.push(t);
  });
  const full = parts.join('. ');
  window.speechSynthesis.cancel();
  // dividir en fragmentos para evitar el límite de longitud
  const chunks = full.match(/[\s\S]{1,200}(?:\.|$)/g) || [full];
  chunks.forEach(c => {
    const u = new SpeechSynthesisUtterance(c.trim());
    u.lang = speechLang();
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  });
}

// Restaurar tamaño guardado + ocultar lectura si no es compatible
document.addEventListener('DOMContentLoaded', () => {
  try {
    const saved = parseInt(localStorage.getItem('p360font'));
    if (!isNaN(saved) && saved >= 0 && saved < FONT_STEPS.length) fontIdx = saved;
  } catch(e){}
  applyFont();
  if (!speechOK) {
    const b = document.getElementById('readToggleBtn');
    if (b) { b.disabled = true; b.textContent = a11yT('a11y_unavailable'); }
  }
});
// Detener la lectura al salir de la página
window.addEventListener('beforeunload', stopSpeak);

// Re-traduce los textos dinámicos del panel al cambiar de idioma
window.refreshA11y = function() {
  // Etiqueta de tamaño de letra
  applyFont();
  // aria-labels y title (no son texto visible, pero ayudan a lectores de pantalla)
  const tgl = document.getElementById('a11yToggle');
  if (tgl) { tgl.setAttribute('aria-label', a11yT('a11y_aria_options')); tgl.setAttribute('title', a11yT('a11y_title').replace(/^[^\wÀ-ÿ]+\s*/, '')); }
  const menu = document.querySelector('.a11y-menu');
  if (menu) menu.setAttribute('aria-label', a11yT('a11y_aria_options'));
  const closeBtn = document.querySelector('.a11y-close');
  if (closeBtn) closeBtn.setAttribute('aria-label', a11yT('a11y_aria_close'));
  // Botón de lectura + pista: respetar el estado actual (activo/inactivo)
  const btn = document.getElementById('readToggleBtn');
  const hint = document.getElementById('a11yHint');
  if (btn && !btn.disabled) btn.textContent = readingMode ? a11yT('a11y_stop') : a11yT('a11y_activate');
  if (hint) hint.textContent = readingMode ? a11yT('a11y_hint_active') : a11yT('a11y_hint');
};



/* ── PWA: registrar Service Worker (modo offline) ──────────────────────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service-worker.js').catch(function () {});
  });
}
