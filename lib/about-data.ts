export interface PaalDetail {
    title: string;
    englishTitle: string;
    chapters: number;
    kurals: number;
    color: string;
    description: string;
    iyals: { name: string; count: number; desc: string }[];
    coreValues: string[];
}

export interface AboutContent {
    hero: {
        badge: string;
        title: string;
        subtitle: string;
    };
    intro: {
        title: string;
        subtitle: string;
        paragraphs: string[];
        stats: { label: string; value: string; hint: string }[];
    };
    author: {
        title: string;
        subtitle: string;
        name: string;
        epithets: { title: string; meaning: string }[];
        description: string[];
        monuments: { name: string; location: string; significance: string }[];
    };
    structure: {
        title: string;
        description: string;
        paals: PaalDetail[];
    };
    marvels: {
        title: string;
        subtitle: string;
        items: { icon: string; title: string; desc: string }[];
    };
    commentators: {
        title: string;
        description: string;
        list: { name: string; era: string; style: string; badge: string }[];
    };
    app: {
        title: string;
        tagline: string;
        features: { icon: string; title: string; desc: string }[];
    };
}

export const aboutData: Record<'ta' | 'en', AboutContent> = {
    ta: {
        hero: {
            badge: "உலகப் பொதுமறை • வாழ்வியல் தத்துவம்",
            title: "திருக்குறள்",
            subtitle: "காலத்தால் அழியாத மனிதநேயப் புதையல்"
        },
        intro: {
            title: "நூலின் சிறப்பு",
            subtitle: "உலகப் பொதுமறையின் பெருமையும் காலத்தால் அழியாத தன்மையும்",
            paragraphs: [
                "திருக்குறள் என்பது தமிழ் மொழியின் ஒப்பற்ற சிகரமாகும். இந்நூல் ஒரு குறிப்பிட்ட இனம், மதம், மொழி, நாடு அல்லது காலத்திற்கு மட்டும் உரியதன்று. மனித குலம் முழுமைக்கும் தேவையான பொதுவான அறநெறிகளைப் போதிப்பதால் இது 'உலகப் பொதுமறை' எனப் போற்றப்படுகிறது.",
                "அகில உலக இலக்கியங்களில் பைபிள், குர்ஆன் ஆகிய புனித நூல்களுக்கு அடுத்தபடியாக உலக மொழிகள் பலவற்றில் மொழிபெயர்க்கப்பட்ட பெருமை திருக்குறளுக்கு மட்டுமே உண்டு. லத்தீன், ஆங்கிலம், ஜெர்மன், பிரெஞ்சு, சீனம், ரஷியன் உள்ளிட்ட 40-க்கும் மேற்பட்ட உலக மொழிகளில் இது மொழிபெயர்க்கப்பட்டுள்ளது.",
                "குறள் வெண்பா என்னும் யாப்பு வடிவத்தில், இரண்டே அடிகளில் ஏழு சீர்களைக் கொண்டு வானளாவிய வாழ்வியல் உண்மைகளை எளிய முறையில் விளக்குவது இதன் ஈடுஇணையற்ற கவிதைச் சிறப்பாகும்.",
                "1730-இல் வீரமாமுனிவர் (Constanzo Beschi) அறத்துப்பாலையும் பொருட்பாலையும் முதன்முதலில் லத்தீன் மொழியில் மொழிபெயர்த்தார்; தொடர்ந்து எஃப்.டபிள்யூ. எல்லிஸ், ஜி.யு. போப் ஆகியோர் ஆங்கிலத்தில் மொழிபெயர்த்து உலகறியச் செய்தனர். மகாத்மா காந்தி, லியோ டால்ஸ்டாய், ஆல்பர்ட் சுவைட்சர் உள்ளிட்ட உலக அறிஞர்களால் பெரிதும் போற்றப்பட்ட நூலாகத் திருக்குறள் திகழ்கிறது.",
                "சங்க மருவிய காலத்து 'பதினெண்கீழ்க்கணக்கு' நூல்களுள் ஒன்றான திருக்குறள், பழங்காலம் தொட்டே முப்பால், பொய்யாமொழி, வாயுறை வாழ்த்து (கசப்பான உண்மையை இனிமையாகத் தரும் மருந்து), தமிழ்மறை, உத்தர வேதம், தெய்வநூல் எனப் பல அரிய பெயர்களால் போற்றப்பட்டு வருகிறது.",
                "அரிய வரலாற்றுச் சிறப்பு: 19-ஆம் நூற்றாண்டின் தொடக்கத்தில் சென்னையில் ஆட்சியராகப் பணியாற்றிய எஃப்.டபிள்யூ. எல்லிஸ் (F.W. Ellis), திருக்குறளின் மீது கொண்ட ஈர்ப்பால் திருவள்ளுவர் உருவம் பொறித்த பொற்காசை வெளியிட்டார். மேலும், 1908-இல் லியோ டால்ஸ்டாய் எழுதிய 'இந்துவுக்கு ஒரு கடிதம்' (A Letter to a Hindu) நூலில் திருக்குறள் கருத்துகளை மேற்கோள் காட்டியது மகாத்மா காந்தியைப் பெரிதும் கவர்ந்தது; காந்தியடிகள் சிறையிலிருந்தபோது திருக்குறளை மூல மொழியில் கற்கத் தமிழ் பயின்றார்.",
                "அறிவியலும் மருத்துவமும்: நவீன மருத்துவம் தோன்றுவதற்குப் பல நூற்றாண்டுகளுக்கு முன்பே 'மருந்து' (அதிகாரம் 95) என்ற தனி அதிகாரத்தில் அளவான உணவு, செரிமானம், நோய்நாடி நோய்முதல் நாடும் மருத்துவ நெறிகளை வள்ளுவர் தெளிவுபடுத்தியுள்ளார்; 'வான்சிறப்பு' (அதிகாரம் 2) வழியே நீர்ச்சுழற்சியையும் சுற்றுச்சூழல் சமநிலையையும் விளக்கியுள்ளார்."
            ],
            stats: [
                { value: "1,330", label: "மொத்தக் குறள்கள்", hint: "அறம், பொருள், இன்பம்" },
                { value: "133", label: "அதிகாரங்கள்", hint: "அதிகாரத்திற்கு 10 குறள்கள்" },
                { value: "3", label: "பெரும் பால்கள்", hint: "அறத்துப்பால், பொருட்பால், காமத்துப்பால்" },
                { value: "9", label: "இயல்கள்", hint: "வாழ்வின் அனைத்து நிலைகளும்" }
            ]
        },
        author: {
            title: "வள்ளுவப் பெருந்தகை",
            subtitle: "மனிதநேயம் போற்றிய மகாகவியின் சிறப்புப் பெயர்களும் நினைவுச் சின்னங்களும்",
            name: "திருவள்ளுவர்",
            description: [
                "திருவள்ளுவர் வாழ்ந்த காலம் கிமு முதல் நூற்றாண்டு முதல் கிபி இரண்டாம் நூற்றாண்டு வரை என்று ஆய்வாளர்களால் கணிக்கப்படுகிறது. இவர் சென்னை மயிலாப்பூரில் நெசவுத் தொழில் செய்து வாழ்ந்த இல்லற ஞானி என்றும், இவர்தம் துணைவியார் வாசுகி அம்மையார் என்றும் இலக்கிய மரபு போற்றுகிறது.",
                "வள்ளுவர் எந்தவொரு மன்னனின் பெயரையோ, குறிப்பிட்ட மதக் கோட்பாட்டையோ, வழிபாட்டு முறைகளையோ நூலில் குறிப்பிடவில்லை. மாந்தர் அனைவரும் சமம் என்னும் 'பிறப்பொக்கும் எல்லா உயிர்க்கும்' என்ற சமத்துவக் கொள்கையை உலகிற்கு முழங்கிய புரட்சிப் புலவர் இவர்.",
                "தமிழக அரசால் கி.மு. 31-ஆம் ஆண்டைத் தொடக்கமாகக் கொண்டு 'திருவள்ளுவர் ஆண்டு' அதிகாரப்பூர்வமாகப் பின்பற்றப்படுகிறது. மேலும், தைத்திங்கள் இரண்டாம் நாள் ஆண்டுதோறும் 'திருவள்ளுவர் திருநாள்' எனச் சிறப்பாகக் கொண்டாடப்படுகிறது."
            ],
            epithets: [
                { title: "நாயனார்", meaning: "தலைசிறந்த குரு மற்றும் வழிகாட்டி" },
                { title: "தெய்வப்புலவர்", meaning: "தெய்வீக சிந்தனை கொண்ட மகா ஞானி" },
                { title: "முதற்பாவலர்", meaning: "கவிஞர்களுக்கெல்லாம் முதன்மையானவர்" },
                { title: "பொய்யாமொழிப் புலவர்", meaning: "எக்காலத்தும் பொய்யாகாத மெய்ம்மொழி உரைத்தவர்" },
                { title: "செந்நாப்போதர்", meaning: "செம்மையான நாவினால் அருள்மொழி பொழிந்தவர்" },
                { title: "மாத்தானுபங்கி", meaning: "உலகளாவிய பெருந்தன்மை கொண்ட ஞானி" }
            ],
            monuments: [
                { name: "திருவள்ளுவர் சிலை", location: "கன்னியாகுமரி", significance: "133 அதிகாரங்களைக் குறிக்கும் 133 அடி உயரச் சிலை: அறத்துப்பால் 38 அதிகாரங்களைக் குறிக்கும் 38 அடி பீடத்தின் மீது, பொருள்-இன்பம் 95 அதிகாரங்களைக் குறிக்கும் 95 அடி சிலையாக அமைக்கப்பட்டுள்ளது." },
                { name: "வள்ளுவர் கோட்டம்", location: "சென்னை", significance: "திருவாரூர்த் தேரின் வடிவில் அமைந்த ஆசியாவின் மிகப்பெரிய நினைவு மண்டபம்; இங்குள்ள பளிங்குக் கற்களில் 1,330 குறள்களும் செதுக்கப்பட்டுள்ளன." }
            ]
        },
        structure: {
            title: "முப்பால் கட்டமைப்பு",
            description: "மனித வாழ்வின் நான்கு உறுதிப் பொருள்களான அறம், பொருள், இன்பம், வீடு என்பவற்றில் வீட்டின்பம் அறத்தின் பயனாக அமைவதால், அறம், பொருள், இன்பம் என்னும் முப்பாலாகத் தொகுக்கப்பட்டது.",
            paals: [
                {
                    title: "அறத்துப்பால்",
                    englishTitle: "Book of Virtue (Dharma)",
                    chapters: 38,
                    kurals: 380,
                    color: "blue",
                    description: "தனிமனித ஒழுக்கம், ஆன்ம சுத்தி, இல்லறக் கடமைகள் மற்றும் துறவற நெறிகளைப் பற்றிப் பேசுகிறது.",
                    iyals: [
                        { name: "பாயிரவியல்", count: 4, desc: "கடவுள் வாழ்த்து, வான்சிறப்பு, நீத்தார் பெருமை, அறன் வலியுறுத்தல்" },
                        { name: "இல்லறவியல்", count: 20, desc: "குடும்ப வாழ்க்கை, அன்பு, விருந்தோம்பல், இனியவை கூறல், ஈகை" },
                        { name: "துறவறவியல்", count: 13, desc: "அருளுடைமை, கொல்லாமை, வாய்மை, துறவு, மெய்யுணர்தல்" },
                        { name: "ஊழியல்", count: 1, desc: "இயற்கையின் நியதியும் விதியின் வலிமையும்" }
                    ],
                    coreValues: ["வாய்மை", "அருளுடைமை", "கொல்லாமை", "ஈகை", "ஒழுக்கமுடைமை"]
                },
                {
                    title: "பொருட்பால்",
                    englishTitle: "Book of Wealth & Statecraft (Artha)",
                    chapters: 70,
                    kurals: 700,
                    color: "purple",
                    description: "அரசியல் நிர்வாகம், பொருளாதார அறிவு, நீதி பரிபாலனம், வெளியுறவுக் கொள்கை மற்றும் சிறந்த குடிமக்கள் பண்புகள்.",
                    iyals: [
                        { name: "அரசியல்", count: 25, desc: "நல்லாட்சி, கல்வி, செங்கோன்மை, கொடுங்கோன்மை நீக்கல்" },
                        { name: "அங்கவியல்", count: 32, desc: "அமைச்சு, நாடு, அரண், படை, நட்பு, குடிமை" },
                        { name: "ஒழிபியல்", count: 13, desc: "குடிமை, நாணுடைமை, மானம், வேளாண்மை, நல்குரவு" }
                    ],
                    coreValues: ["தலைமைப் பண்பு", "பொருளாதார விவேகம்", "நட்பு", "விடாமுயற்சி", "கல்வி"]
                },
                {
                    title: "காமத்துப்பால்",
                    englishTitle: "Book of Love & Harmony (Kama)",
                    chapters: 25,
                    kurals: 250,
                    color: "pink",
                    description: "தலைவன் தலைவியரின் தூய காதல் உணர்வுகள், உளவியல் நுண்ணிய பார்வைகள் மற்றும் இல்லற இன்பம்.",
                    iyals: [
                        { name: "களவியல்", count: 7, desc: "இயற்கைப் புணர்ச்சி, குறிப்பறிதல், காதற் சிறப்பு" },
                        { name: "கற்பியல்", count: 18, desc: "இல்லறக் காதல், பிரிவுத் துயர், புலவி, ஊடல் மற்றும் கூடல்" }
                    ],
                    coreValues: ["தூய அன்பு", "உளவியல் புரிதல்", "கற்பு நெறி", "இன்ப நுகர்ச்சி"]
                }
            ]
        },
        marvels: {
            title: "இலக்கிய அழகுகள்",
            subtitle: "திருக்குறளின் அமைப்பில் பொதிந்துள்ள நுட்பமான இலக்கிய அழகுகள்",
            items: [
                { icon: "🔤", title: "அகரத்தில் தொடங்கி னகரத்தில் முடிதல்", desc: "தமிழ் நெடுங்கணக்கின் முதல் எழுத்தாகிய 'அ'-வில் தொடங்கி (அகர முதல எழுத்தெல்லாம்), இறுதி மெய்யெழுத்தாகிய 'ன்'-னில் முடிகிறது (துஞ்சப் பெறின்)." },
                { icon: "⚖️", title: "மதச்சார்பற்ற தூய மானுடவியல்", desc: "முழு நூலிலும் எந்த ஒரு கடவுளின் பெயரோ, குறிப்பிட்ட சமயத்தின் பெயரோ, நாட்டின் பெயரோ இடம்பெறவில்லை." },
                { icon: "📏", title: "ஏழு சீர் கவிதை வடிவம்", desc: "முதல் அடியில் நான்கு சீர்களும், இரண்டாம் அடியில் மூன்று சீர்களுமாக மொத்தம் ஏழு சீர்களில் பிரபஞ்சத் தத்துவங்களை அடக்கியது." },
                { icon: "🔢", title: "எண்களின் சிறப்பு", desc: "நூலில் 'ஒன்பது' என்ற எண் எந்தக் குறளிலும் பயன்படுத்தப்படவில்லை. ஆனால் 'ஏழு' என்னும் எண் பரவலாகப் பேசப்படுகிறது." },
                { icon: "🌍", title: "'தமிழ்' என்ற சொல் இல்லாத தமிழ் நூல்", desc: "தமிழின் தலைசிறந்த நூலாக இருந்தாலும், 1,330 குறள்களிலும் 'தமிழ்' என்ற சொல்லோ எந்தவொரு நாட்டின் பெயரோ இடம்பெறவில்லை — இது இதன் உலகளாவிய பார்வையைக் காட்டுகிறது." },
                { icon: "📜", title: "1812-இல் முதன்முதலில் அச்சேறிய நூல்", desc: "ஓலைச்சுவடிகளில் பாதுகாக்கப்பட்ட திருக்குறள், 1812-ஆம் ஆண்டு தஞ்சாவூரில் ஞானப்பிரகாசர் என்பவரால் முதன்முதலில் அச்சிடப்பட்டுப் புத்தகமாக வெளியிடப்பட்டது." },
                { icon: "👑", title: "53 புலவர்கள் பாடிய 'திருவள்ளுவ மாலை'", desc: "சங்க காலத்து 53 புலவர்கள் திருக்குறளின் பெருமையைப் போற்றிப் பாடிய 55 பாடல்களின் தொகுப்பு 'திருவள்ளுவ மாலை' எனப் போற்றப்படுகிறது." },
                { icon: "✍️", title: "'ஔ' எழுத்து இல்லாத அமைப்பும் 'கோடி' என்ற எண்ணும்", desc: "திருக்குறளில் 'ஔ' என்ற உயிரெழுத்து ஒரு இடத்திலும் பயன்படுத்தப்படவில்லை. மேலும், நூலில் குறிப்பிடப்படும் மிகப்பெரிய எண் 'கோடி' (குறள் 377) ஆகும்." }
            ]
        },
        commentators: {
            title: "உரையாசிரியர்கள்",
            description: "திருக்குறளுக்குப் பல அறிஞர்கள் உரை எழுதியுள்ளனர். பழங்காலத்தில் மணக்குடவர், பரிப்பெருமாள், காலிங்கர், பரிதி, பரிமேலழகர் உள்ளிட்ட 'பத்து உரையாசிரியர்கள்' புகழ்பெற்றவர்கள். நமது செயலியில் செவ்வியல் உரையான பரிமேலழகர் உரையுடன், நவீன தலைமுறைக்கு ஏற்ற மூன்று எளிய உரைகளும் சேர்க்கப்பட்டுள்ளன:",
            list: [
                { name: "மு. வரதராசனார் (மு.வ.)", era: "நவீன காலம் (20-ஆம் நூற்றாண்டு)", style: "எளிய, தெளிவான, யாவரும் எளிதில் உணரத்தக்க தூய தமிழ் உரை; மாணவர்களும் பொதுமக்களும் பெரிதும் விரும்பும் 'திருக்குறள் தெளிவுரை' படைத்தவர்.", badge: "மிகவும் பிரசித்தி பெற்றது" },
                { name: "கலைஞர் மு. கருணாநிதி", era: "நவீன காலம் (20-ஆம் நூற்றாண்டு)", style: "இலக்கிய நயமும், சமூக விழிப்புணர்வும், கவிதை நடையும் கலந்த 'குறளோவியம்' மற்றும் உரை விளக்கங்களின் மூலம் குறளை மக்கள் மன்றத்தில் எளிமைப்படுத்தியவர்.", badge: "கவித்துவ நடை" },
                { name: "சாலமன் பாப்பையா", era: "நவீன காலம் (21-ஆம் நூற்றாண்டு)", style: "பேச்சுத் தமிழ் எளிமையும் நடைமுறை வாழ்வியல் உதாரணங்களும் நிறைந்த உரை; மேடைப் பேச்சு மற்றும் ஊடகங்கள் வழியே குறளைப் பரப்பியவர்.", badge: "எளிய மக்கள் உரை" },
                { name: "பரிமேலழகர்", era: "பழங்காலம் (கி.பி. 13-ஆம் நூற்றாண்டு)", style: "காஞ்சிபுரத்தைச் சேர்ந்த இவர் எழுதிய உரை, தொன்மை வாய்ந்த உரைகளில் இலக்கண, தத்துவ ஆழமும் தருக்க நுட்பமும் மிக்க தலைசிறந்த செவ்வியல் உரையாகப் போற்றப்படுகிறது.", badge: "செவ்வியல் உரை" },
                { name: "மணக்குடவர்", era: "பழங்காலம் (கி.பி. 10–11-ஆம் நூற்றாண்டு)", style: "திருக்குறளுக்குக் கிடைத்துள்ள மிகப் பழமையான முழு உரை இவருடையதே; தொன்மையான பாட வேறுபாடுகளையும் எளிய நேர் பொருளையும் பாதுகாத்த முன்னோடி உரையாசிரியர்.", badge: "முதல் உரையாசிரியர்" },
                { name: "காலிங்கர்", era: "பழங்காலம் (கி.பி. 12–13-ஆம் நூற்றாண்டு)", style: "பத்து உரையாசிரியர்களில் சொல்நயமும் நுண்ணிய பொருள் விளக்கமும் வாழ்வியல் உவமைகளும் கொண்டு குறளுக்கு விரிவான விளக்கம் அளித்தவர்.", badge: "பழைய உரை" }
            ]
        },
        app: {
            title: "இச்செயலியின் சிறப்பம்சங்கள்",
            tagline: "நவீன தலைமுறையினருக்குத் திருக்குறளின் ஞானத்தை எளிய, கண்ணாடி போன்ற தூய இடைமுகத்தில் வழங்குதல்.",
            features: [
                { icon: "⚡", title: "இருமொழி உடனடித் தேடல்", desc: "குறள் எண், தமிழ் வார்த்தைகள், ஆங்கில எழுத்துப்பெயர்ப்பு மூலம் மின்னல் வேகத்தில் தேடலாம்." },
                { icon: "🧠", title: "AI விளக்கப் பகுப்பாய்வு", desc: "ஒவ்வொரு குறளுக்கும் நவீன கால சூழல் (Context), உள்ளார்ந்த தத்துவம் (Insight) மற்றும் பயனுள்ள பாடம் (Takeaway) அறியலாம்." },
                { icon: "🔖", title: "உள்ளமைந்த சேமிப்பகம் (Bookmarks)", desc: "பிடித்த குறள்களை உள்நுழைவு இன்றியே உங்கள் உலாவியிலேயே பாதுகாப்பாகச் சேமித்து வைத்துப் படிக்கலாம்." },
                { icon: "✨", title: "அழகிய வண்ணங்கள்", desc: "இரவு மற்றும் பகல் நேரங்களுக்கு உகந்த, கண்களுக்கு இதமான அழகிய நவீன வடிவமைப்பு." },
                { icon: "📱", title: "எல்லா சாதனங்களிலும் ஆஃப்லைன் பயன்பாடு", desc: "இச்செயலியை உங்கள் கணினி (Desktop) அல்லது கைபேசியில் (Mobile) நிறுவி, இணைய இணைப்பு இல்லாமலும் எளிதாகப் பயன்படுத்தலாம்." }
            ]
        }
    },
    en: {
        hero: {
            badge: "Universal Veda • Timeless Philosophy",
            title: "Thirukkural",
            subtitle: "A Timeless Treasure of Universal Humanism"
        },
        intro: {
            title: "Significance & Timeless Universality",
            subtitle: "Why Thirukkural stands as a universal ethical masterpiece",
            paragraphs: [
                "The Thirukkural (literally 'Sacred Couplets') is the pinnacle of classical Tamil literature and one of the most widely revered ethical works in world philosophy. It is praised as 'Ulaga Podhumarai' (The Universal Veda) because it does not advocate any religion, sect, nation, or caste.",
                "It is celebrated as one of the most translated non-religious literary works in human history, translated into more than 40 languages including Latin, English, German, French, Chinese, and Russian — standing alongside the Bible and Quran in global reach.",
                "Engineered in the precise Kural Venba meter, each couplet encapsulates profound cosmological and existential wisdom in exactly seven words across two concise lines.",
                "In 1730, Constanzo Beschi (Veeramamunivar) translated the first two books into Latin, followed by landmark English translations by F.W. Ellis and G.U. Pope. Thinkers such as Mahatma Gandhi, Leo Tolstoy, and Albert Schweitzer praised its universal moral clarity.",
                "Part of the classical Pathinenkilkanakku (Eighteen Lesser Texts) canon, Thirukkural has been revered for centuries under rare traditional epithets including Muppaal (Threefold Path), Poiyamozhi (Unfailing Word), Vayurai Vazhthu ('wholesome medicine of truth'), Uthara Vedam, and Tamil Marai.",
                "Rare Historical Notes: In the early 19th century, Madras Collector F.W. Ellis admired the text so deeply that he minted a gold coin bearing Saint Thiruvalluvar's image. In 1908, Leo Tolstoy quoted Thirukkural couplets in 'A Letter to a Hindu', deeply moving Mahatma Gandhi—who later studied Tamil in prison to read Thirukkural in the original.",
                "Scientific & Medical Foresight: Centuries before modern preventive medicine, Chapter 95 ('Marundhu' / Medicine) laid out holistic principles of balanced diet, digestion, and root-cause diagnosis, while Chapter 2 ('Vaan Sirappu') eloquently described the hydrological cycle and ecological interdependence."
            ],
            stats: [
                { value: "1,330", label: "Couplets (Kurals)", hint: "Virtue, Wealth, Love" },
                { value: "133", label: "Chapters (Adhigarams)", hint: "10 Kurals per Chapter" },
                { value: "3", label: "Grand Sections (Paals)", hint: "Virtue, Wealth, and Love" },
                { value: "9", label: "Sub-Sections (Iyals)", hint: "Every facet of life" }
            ]
        },
        author: {
            title: "The Sage Philosopher",
            subtitle: "Epithets, humanist vision, and enduring monuments of the sage",
            name: "Thiruvalluvar",
            description: [
                "Saint Thiruvalluvar is revered as a preeminent philosopher-poet of the classical Sangam era (historically dated between the 2nd century BCE and 2nd century CE). Literary tradition associates him with Mylapore in Chennai, where he lived as a humble weaver and householder alongside his devoted wife Vasuki.",
                "He never mentioned any ruling dynasty, mythological deity, or religious dogma. Instead, he pioneered universal humanism, championing the revolutionary egalitarian doctrine: 'Pirappokkum Ella Uyirkkum' — 'All living beings are born equal by birth'.",
                "The Government of Tamil Nadu officially follows the Thiruvalluvar Era (starting from 31 BCE) and celebrates Thiruvalluvar Day annually on the second day of the Tamil month of Thai during Pongal."
            ],
            epithets: [
                { title: "Nayanar", meaning: "The Revered Guide and Master" },
                { title: "Deiva Pulavar", meaning: "The Divine Philosophical Bard" },
                { title: "Mutharpavalar", meaning: "The First and Foremost Poet" },
                { title: "Poiyamozhi Pulavar", meaning: "The Poet Whose Words Never Fail" },
                { title: "Sennappothar", meaning: "The Eloquent Tongue of Truth" },
                { title: "Madhanubhangi", meaning: "The Sage of Boundless Magnanimity" }
            ],
            monuments: [
                { name: "Thiruvalluvar Statue", location: "Kanyakumari", significance: "A 133-foot stone colossus at the confluence of three oceans: a 38-foot pedestal symbolizing the 38 Virtue chapters supporting a 95-foot statue for the 95 Wealth and Love chapters." },
                { name: "Valluvar Kottam", location: "Chennai", significance: "A monumental 39-meter stone chariot auditorium modeled after the Thiruvarur temple car, housing all 1,330 couplets carved on granite pillars." }
            ]
        },
        structure: {
            title: "The Tripartite Architecture",
            description: "Structured according to the ancient Indian concept of human aims (Dharma, Artha, Kama, Moksha), with liberation (Moksha) realized organically through the dedicated practice of virtue.",
            paals: [
                {
                    title: "Arathuppaal",
                    englishTitle: "Book of Virtue (Righteousness)",
                    chapters: 38,
                    kurals: 380,
                    color: "blue",
                    description: "Guides personal ethics, soul purification, family responsibilities, and the ascetic pursuit of spiritual truth.",
                    iyals: [
                        { name: "Payiraviyal (Prologue)", count: 4, desc: "Praise of God, Rain, Great Men, Asserting Virtue" },
                        { name: "Illaraviyal (Domestic Virtue)", count: 20, desc: "Family life, hospitality, compassion, charity, moral rectitude" },
                        { name: "Thuravaraviyal (Ascetic Virtue)", count: 13, desc: "Grace, non-killing, truthfulness, renunciation, true knowledge" },
                        { name: "Oozhiyal (Destiny)", count: 1, desc: "The cosmic law of cause, effect, and destiny" }
                    ],
                    coreValues: ["Truthfulness (Vaimai)", "Compassion", "Ahimsa (Non-violence)", "Charity", "Moral Conduct"]
                },
                {
                    title: "Porutpaal",
                    englishTitle: "Book of Wealth & Statecraft",
                    chapters: 70,
                    kurals: 700,
                    color: "purple",
                    description: "Comprehensive blueprint for political governance, defense diplomacy, economic wisdom, citizenship, and societal welfare.",
                    iyals: [
                        { name: "Arasiyal (Royalty & Leadership)", count: 25, desc: "Ideal ruler, learning, just rule, eschewing tyranny" },
                        { name: "Angaviyal (Limbs of the State)", count: 32, desc: "Ministers, state, fortresses, wealth, military, diplomacy" },
                        { name: "Ozhibiyal (Miscellaneous Citizenship)", count: 13, desc: "Nobility, honor, agriculture, perseverance, modesty" }
                    ],
                    coreValues: ["Visionary Leadership", "Economic Prudence", "Diplomacy", "Relentless Effort", "Nobility"]
                },
                {
                    title: "Kamathuppaal",
                    englishTitle: "Book of Love & Harmonious Intimacy",
                    chapters: 25,
                    kurals: 250,
                    color: "pink",
                    description: "Psychological subtleties, romantic aesthetics, intimate companionship, emotional nuances, and wedded bliss.",
                    iyals: [
                        { name: "Kalaviyal (Courtship & Secret Love)", count: 7, desc: "Divine meeting, understanding signs, beauty of romantic bond" },
                        { name: "Karpiyal (Wedded Love & Harmony)", count: 18, desc: "Pangs of separation, lover's quarrel, reunion and emotional ecstasy" }
                    ],
                    coreValues: ["Unconditional Love", "Emotional Empathy", "Chastity & Loyalty", "Psychological Harmony"]
                }
            ]
        },
        marvels: {
            title: "Mathematical & Linguistic Marvels",
            subtitle: "Subtle structural, numerical, and poetic wonders within the text",
            items: [
                { icon: "🔤", title: "Alpha to Omega Symmetry", desc: "Begins with the very first letter of the Tamil alphabet 'அ' (A) and concludes precisely with the final consonant 'ன்' (N)." },
                { icon: "⚖️", title: "Pure Secular Humanism", desc: "The work never mentions any personalized deity, religious ritual, temple, or royal kingdom — applicable to all humanity." },
                { icon: "📏", title: "The Seven Metrical Feet", desc: "Every Kural contains exactly seven metric feet (seer): four in the top line and three in the second, condensing infinity into brevity." },
                { icon: "🔢", title: "Curious Numerical Facts", desc: "The number 'Nine' is never used across all 1,330 couplets, while the sacred number 'Seven' holds profound prominence throughout." },
                { icon: "🌍", title: "Never Mentions the Word 'Tamil'", desc: "Despite being the crown jewel of Tamil literature, the word 'Tamil' never appears in any of the 1,330 couplets — underscoring its universal message for all humanity." },
                { icon: "📜", title: "First Printed in 1812", desc: "Preserved for centuries on palm-leaf manuscripts, Thirukkural became one of the earliest Tamil classics to be printed in book form by Gnana Prakasar in Thanjavur in 1812." },
                { icon: "👑", title: "Praised in 'Thiruvalluva Maalai'", desc: "An entire classical anthology of 55 verses, 'Thiruvalluva Maalai', was composed by 53 Sangam poets solely in praise of the brilliance of Thirukkural." },
                { icon: "✍️", title: "Omits 'ஔ' & Reaches 'Kodi' (Ten Million)", desc: "The Tamil vowel 'ஔ' (Au) does not appear anywhere across all 1,330 couplets, while the largest number explicitly mentioned in the work is 'Kodi' (ten million, e.g., Kural 377)." }
            ]
        },
        commentators: {
            title: "Distinguished Commentaries",
            description: "Centuries of scholarship have enriched the understanding of Thirukkural, led by the classical 'Ten Commentators' (Manakudavar, Paripperumal, Kalingar, Paridhi, Parimelalhagar, and others). Our platform integrates Parimelalhagar's classical commentary alongside three acclaimed modern explanations:",
            list: [
                { name: "Dr. Mu. Varadarajan (Mu. Va.)", era: "Modern Era (20th Century)", style: "Crystal-clear, concise, and academically precise contemporary Tamil prose; author of the beloved 'Thirukkural Thelivurai' cherished by students and scholars alike.", badge: "Most Popular" },
                { name: "Kalaignar M. Karunanidhi", era: "Modern Era (20th Century)", style: "Vibrant, poetic rhythm enriched with deep social consciousness and Dravidian eloquence through his acclaimed 'Kuraloviyam' and accessible modern commentary.", badge: "Poetic & Social" },
                { name: "Prof. Solomon Pappaiah", era: "Modern Era (21st Century)", style: "Conversational, practical everyday Tamil filled with relatable life examples, popularizing Thirukkural widely through public discourse and media.", badge: "Grassroots Wisdom" },
                { name: "Parimelalhagar", era: "Classical Era (13th Century CE)", style: "A scholar from Kanchipuram whose commentary is celebrated as the crowning classical synthesis of Tamil grammar, philosophy, and logical rigor.", badge: "Classical Gold Standard" },
                { name: "Manakudavar", era: "Classical Era (10th–11th Century CE)", style: "Author of the oldest surviving complete commentary on Thirukkural, prized by textual scholars for preserving early verse readings and direct literal meaning.", badge: "Earliest Extant Urai" },
                { name: "Kalingar", era: "Classical Era (12th–13th Century CE)", style: "Renowned among the classical ten commentators for sharp lexical precision and vivid real-life analogies illuminating subtle couplets.", badge: "Classical Commentary" }
            ]
        },
        app: {
            title: "About This Modern Explorer",
            tagline: "Bridging ancient wisdom with modern interactive glassmorphism technology.",
            features: [
                { icon: "⚡", title: "Lightning Bilingual Search", desc: "Search instantly by verse number, Tamil keywords, English transliteration, or chapter title." },
                { icon: "🧠", title: "AI-Powered Deconstruction", desc: "Unpack each couplet with contemporary Context, philosophical Core Insight, and actionable Modern Takeaways." },
                { icon: "🔖", title: "Zero-Friction Offline Bookmarks", desc: "Save and curate your personal collection directly in your browser without requiring any login." },
                { icon: "✨", title: "Fluid Glassmorphic Aesthetic", desc: "Frosted translucent glass interfaces crafted with light/dark adaptive color grading." },
                { icon: "📱", title: "Installable & Offline-Ready", desc: "Install the app directly on your desktop or mobile device and explore Kurals seamlessly even without an internet connection." }
            ]
        }
    }
};
