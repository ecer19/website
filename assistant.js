/* ===========================================
   Ece Portfolio
   assistant.js — Bedrock (Gemma 4 31B) destekli asistan
=========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* Mobil klavye açıldığında görünen alanı küçültür; asistan panelinin
       klavyenin altında kalmaması için --kb-offset değişkenini güncelliyoruz */
    if(window.visualViewport){

        const vv = window.visualViewport;

        const updateKeyboardOffset = () => {
            const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
            document.documentElement.style.setProperty("--kb-offset", offset + "px");
        };

        vv.addEventListener("resize", updateKeyboardOffset);
        vv.addEventListener("scroll", updateKeyboardOffset);

    }

    const toggle = document.getElementById("assistantToggle");
    const panel = document.getElementById("assistantPanel");
    const closeBtn = document.getElementById("assistantClose");
    const form = document.getElementById("assistantForm");
    const input = document.getElementById("assistantInput");
    const sendBtn = form.querySelector("button[type='submit']");
    const messages = document.getElementById("assistantMessages");

    const suggestedQuestions = [
        "Ece kimdir?",
        "İlgi alanları neler?",
        "Gelecek hedefleri neler?"
    ];

    const history = [];

    /* Basit metin içindeki URL/e-posta adreslerini tıklanabilir linke çevirir */
    function renderBotContent(container, text){

        const pattern = /(https?:\/\/[^\s]+)|([\w.+-]+@[\w-]+\.[\w.-]+)/g;

        let lastIndex = 0;
        let match;

        while((match = pattern.exec(text)) !== null){

            if(match.index > lastIndex){
                container.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            }

            const value = match[0];
            const a = document.createElement("a");

            a.className = "assistant-link";
            a.textContent = value;

            if(value.includes("@")){
                a.href = "mailto:" + value;
            } else {
                a.href = value;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
            }

            container.appendChild(a);

            lastIndex = match.index + value.length;

        }

        if(lastIndex < text.length){
            container.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

    }

    function addMessage(text, sender){

        const bubble = document.createElement("div");

        bubble.className = "assistant-msg " + sender;

        if(sender === "bot"){
            renderBotContent(bubble, text);
        } else {
            bubble.textContent = text;
        }

        messages.appendChild(bubble);

        messages.scrollTop = messages.scrollHeight;

        return bubble;

    }

    function removeSuggestions(){

        const el = document.getElementById("assistantSuggestions");

        if(el) el.remove();

    }

    function renderSuggestions(){

        const wrap = document.createElement("div");

        wrap.id = "assistantSuggestions";
        wrap.className = "assistant-suggestions";

        suggestedQuestions.forEach(question => {

            const btn = document.createElement("button");

            btn.type = "button";
            btn.className = "assistant-suggestion";
            btn.textContent = question;

            btn.addEventListener("click", () => sendMessage(question));

            wrap.appendChild(btn);

        });

        messages.appendChild(wrap);

        messages.scrollTop = messages.scrollHeight;

    }

    async function sendMessage(rawText){

        const text = rawText.trim();

        if(!text) return;

        removeSuggestions();

        addMessage(text, "user");

        history.push({ role: "user", content: text });

        const typingBubble = addMessage("Cevap hazırlanıyor...", "bot");

        typingBubble.classList.add("typing");

        sendBtn.disabled = true;
        input.disabled = true;

        try {

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: history })
            });

            const data = await response.json();

            typingBubble.remove();

            if(!response.ok || !data.reply){
                addMessage("Şu anda cevap oluşturulamıyor. Lütfen birkaç saniye sonra tekrar dene.", "bot");
                return;
            }

            addMessage(data.reply, "bot");

            history.push({ role: "assistant", content: data.reply });

        } catch(err){

            typingBubble.remove();

            addMessage("Bağlantı sorunu yaşandı. Lütfen birkaç saniye sonra tekrar dene.", "bot");

        } finally {

            sendBtn.disabled = false;
            input.disabled = false;
            input.focus();

        }

    }

    let started = false;

    function openPanel(){

        panel.classList.add("open");

        if(!started){

            started = true;

            addMessage("Merhaba! Ben Ece'nin asistanıyım. Ona okulu, ilgi alanları, hobileri, projeleri ya da hedefleri hakkında soru sorabilirsin.", "bot");

            renderSuggestions();

        }

        input.focus();

    }

    function closePanel(){

        panel.classList.remove("open");

    }

    toggle.addEventListener("click", () => {

        panel.classList.contains("open") ? closePanel() : openPanel();

    });

    closeBtn.addEventListener("click", closePanel);

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const text = input.value;

        input.value = "";

        sendMessage(text);

    });

});
