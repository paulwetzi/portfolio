document.addEventListener('DOMContentLoaded', () => {
    const cookie = document.getElementById('cookie');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let cookiesPerSecond = 0;


    const upgrades = {
        Maus: { amount: 0, cps: 0.5, price: 15, buttonId: "buy-cursour"},
        Oma: { amount: 0, cps: 2, price: 100, buttonId: "buy-grandma"},
        Bauernhof: { amount: 0, cps: 5, price: 500, buttonId: "buy-farm"},
        Mine: { amount: 0, cps: 10, price: 1000, buttonId: "buy-mine"},
        Fabrik: { amount: 0, cps: 25, price: 5000, buttonId: "buy-factory"}
    };

    const savedScore = localStorage.getItem('cookieScore');
    const savedUpgrades = localStorage.getItem("cookieUpgrades");

    if (savedScore !== null) {
        score = parseInt(savedScore);
        updateScore();
    }

    if(savedUpgrades !== null) {
        const parsedUpgrades = JSON.parse(savedUpgrades);

        Object.keys(parsedUpgrades).forEach(key => {
            if (upgrades[key]) {
                upgrades[key].amount = parsedUpgrades[key].amount;
                upgrades[key].price = parsedUpgrades[key].price;

                const button = document.getElementById(upgrades[key].buttonId);
                if (button) {
                    const textElement = button.querySelector('p');
                    if(textElement) {
                        textElement.textContent = `${key} (${upgrades[key].amount}) - ${upgrades[key].price} 🍪`;
                    }
                }
            }
        });
        updateCookiesPerSecond();
    }

    if (cookie) {
        cookie.addEventListener('click', () => {
            score++;
            updateScore();
            saveGame();
            //scoreDisplay.textContent = score;
            cookie.classList.add('click-animation');

            setTimeout(() => {
                cookie.classList.remove('click-animation');
            }, 200);
        })
    }

    Object.keys(upgrades).forEach(key => {
        const upgrade = upgrades[key];
        const button = document.getElementById(upgrade.buttonId);

        if(button) {
            button.addEventListener('click', () => {
                if (score >= upgrade.price) {
                    score -= upgrade.price;
                    upgrade.amount++;
                    upgrade.price = Math.floor(upgrade.price * 1.15);

                    const textElement = button.querySelector('p');
                    if (textElement) {
                        textElement.textContent = `${key} (${upgrade.amount}) - ${upgrade.price} 🍪`;
                    }
                   
                    button.classList.add('upgrade-animation');
                    setTimeout(() => {
                        button.classList.remove('upgrade-animation');
                    }, 400);

                    updateCookiesPerSecond();
                    updateScore();
                    saveGame();
                } else {
                    alert("Nicht genug Cookies");
                }
            })
        }
    })

    function updateCookiesPerSecond() {
        cookiesPerSecond = 0;
        Object.values(upgrades).forEach(upgrade => {
            cookiesPerSecond += upgrade.amount * upgrade.cps;
        })
    }

    setInterval(() => {
        score += cookiesPerSecond;
        updateScore();
    }, 1000);

    function updateScore() {
        scoreDisplay.textContent = Math.floor(score);
    }

    function saveGame() {
        localStorage.setItem('cookieScore', score);
        localStorage.setItem('cookieUpgrades', JSON.stringify(upgrades));
    }

});