/* ===========================================
   Ece Portfolio
   script.js
=========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------
       Scroll Reveal
    ----------------------------- */

    const reveals = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("active");

            }

        });

    },{

        threshold:0.15

    });

    reveals.forEach(item=>{

        revealObserver.observe(item);

    });

    /* -----------------------------
       Scroll Top
    ----------------------------- */

    const scrollBtn=document.getElementById("scrollTop");

    window.addEventListener("scroll",()=>{

        if(window.scrollY>500){

            scrollBtn.classList.add("show");

        }else{

            scrollBtn.classList.remove("show");

        }

    });

    scrollBtn.addEventListener("click",()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

    /* -----------------------------
       Random Stars
    ----------------------------- */

    const stars=document.getElementById("stars");

    const STAR_COUNT=170;

    for(let i=0;i<STAR_COUNT;i++){

        const star=document.createElement("span");

        const size=Math.random()*3+1;

        star.style.width=size+"px";
        star.style.height=size+"px";

        star.style.left=Math.random()*100+"%";
        star.style.top=Math.random()*100+"%";

        star.style.opacity=Math.random();

        star.style.animationDuration=(2+Math.random()*6)+"s";

        star.style.animationDelay=(Math.random()*6)+"s";

        stars.appendChild(star);

    }

    /* -----------------------------
       Mouse Parallax
    ----------------------------- */

    const hero=document.querySelector(".hero-right");

    document.addEventListener("mousemove",(e)=>{

        const x=(e.clientX/window.innerWidth-.5)*20;

        const y=(e.clientY/window.innerHeight-.5)*20;

        hero.style.transform=`
        translate(${x}px,${y}px)
        `;

    });

    /* -----------------------------
       Floating Cards
    ----------------------------- */

    const cards=document.querySelectorAll(".card,.club,.contact-item");

    cards.forEach(card=>{

        card.addEventListener("mousemove",(e)=>{

            const rect=card.getBoundingClientRect();

            const x=e.clientX-rect.left;

            const y=e.clientY-rect.top;

            const centerX=rect.width/2;

            const centerY=rect.height/2;

            const rotateX=(centerY-y)/18;

            const rotateY=(x-centerX)/18;

            card.style.transform=

            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-10px)`;

        });

        card.addEventListener("mouseleave",()=>{

            card.style.transform="";

        });

    });

    /* -----------------------------
       Navbar Blur
    ----------------------------- */

    const header=document.querySelector(".header");

    window.addEventListener("scroll",()=>{

        if(window.scrollY>50){

            header.style.top="10px";

            header.style.transition=".4s";

        }else{

            header.style.top="20px";

        }

    });

    /* -----------------------------
       Smooth Anchor
    ----------------------------- */

    document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

        anchor.addEventListener("click",function(e){

            e.preventDefault();

            const target=document.querySelector(this.getAttribute("href"));

            if(target){

                target.scrollIntoView({

                    behavior:"smooth",

                    block:"start"

                });

            }

        });

    });

    /* -----------------------------
       Mobile Menu
    ----------------------------- */

    const menuToggle=document.getElementById("menuToggle");

    const mobileNav=document.querySelector(".nav nav");

    function closeMenu(){

        menuToggle.classList.remove("open");

        mobileNav.classList.remove("open");

        menuToggle.setAttribute("aria-expanded","false");

    }

    menuToggle.addEventListener("click",()=>{

        const isOpen=mobileNav.classList.toggle("open");

        menuToggle.classList.toggle("open",isOpen);

        menuToggle.setAttribute("aria-expanded",isOpen?"true":"false");

    });

    mobileNav.querySelectorAll("a").forEach(link=>{

        link.addEventListener("click",closeMenu);

    });

    document.addEventListener("click",(e)=>{

        if(!mobileNav.classList.contains("open")) return;

        if(!e.target.closest(".nav")){

            closeMenu();

        }

    });

    /* -----------------------------
       Hero Glow Animation
    ----------------------------- */

    const glows=document.querySelectorAll(".glow");

    let angle=0;

    function animateGlow(){

        angle+=0.004;

        glows.forEach((glow,index)=>{

            const radius=15+(index*8);

            glow.style.transform=

            `translate(
            ${Math.cos(angle+index)*radius}px,
            ${Math.sin(angle+index)*radius}px
            )`;

        });

        requestAnimationFrame(animateGlow);

    }

    animateGlow();

    /* -----------------------------
       Random Star Flicker
    ----------------------------- */

    setInterval(()=>{

        const randomStar=

        stars.children[Math.floor(Math.random()*stars.children.length)];

        if(!randomStar) return;

        randomStar.animate([

            {

                opacity:.2,

                transform:"scale(.8)"

            },

            {

                opacity:1,

                transform:"scale(2)"

            },

            {

                opacity:.3,

                transform:"scale(1)"

            }

        ],{

            duration:900,

            easing:"ease-out"

        });

    },180);

});