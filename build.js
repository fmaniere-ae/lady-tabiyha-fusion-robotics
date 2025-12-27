// build.js - Génère index.html à partir du contenu CMS
const fs = require('fs');
const path = require('path');

// Parser YAML basique
function parseYAML(yaml) {
    const lines = yaml.split('\n');
    const result = {};
    let currentKey = null;
    let currentObj = result;
    let indent = 0;
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        
        const currentIndent = line.search(/\S/);
        
        if (line.includes(':')) {
            const [key, ...valueParts] = trimmed.split(':');
            const value = valueParts.join(':').trim();
            
            if (!value || value === '|') {
                currentKey = key.trim();
                currentObj[currentKey] = value === '|' ? '' : {};
                indent = currentIndent;
            } else if (value.startsWith('"') || value.startsWith("'")) {
                currentObj[key.trim()] = value.slice(1, -1);
            } else {
                currentObj[key.trim()] = value;
            }
        } else if (trimmed.startsWith('-')) {
            const value = trimmed.substring(1).trim();
            if (!Array.isArray(currentObj[currentKey])) {
                currentObj[currentKey] = [];
            }
            
            if (value.startsWith('"') || value.startsWith("'")) {
                currentObj[currentKey].push(value.slice(1, -1));
            } else {
                currentObj[currentKey].push(value);
            }
        } else if (currentKey && currentIndent > indent) {
            if (typeof currentObj[currentKey] === 'string') {
                currentObj[currentKey] += '\n' + trimmed;
            }
        }
    });
    
    return result;
}

// Lire le contenu markdown
function loadContent(filepath) {
    const content = fs.readFileSync(filepath, 'utf-8');
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (!match) {
        throw new Error('Format markdown invalide');
    }
    
    return {
        data: parseYAML(match[1]),
        content: match[2]
    };
}

// Générer HTML
function generateHTML(data) {
    const hero = data.hero || {};
    const about = data.about || {};
    const benefits = data.benefits || [];
    const progBegin = data.program_beginners || {};
    const progAdv = data.program_advanced || {};
    const org = data.organization || {};
    const sec = data.security || {};
    
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atelier Coding pour Enfants</title>

    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
    <script>
    const tokenMatch = window.location.hash.match(/#invite_token=(.+)/);
    if (tokenMatch) {
        const token = tokenMatch[1];
        // Redirige vers /admin avec le token
        window.location.href = "/admin/#invite_token="+token;
    }
    </script>


    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .section-spacing { scroll-margin-top: 80px; }
    </style>
</head>
<body class="font-sans antialiased">
    <nav class="bg-white shadow-md fixed w-full top-0 z-50">
        <div class="max-w-6xl mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold text-purple-600">Atelier Coding</h1>
                <div class="hidden md:flex space-x-6">
                    <a href="#qui-sommes-nous" class="text-gray-700 hover:text-purple-600 transition">Qui sommes-nous</a>
                    <a href="#pourquoi-inscrire" class="text-gray-700 hover:text-purple-600 transition">Pourquoi inscrire</a>
                    <a href="#programme" class="text-gray-700 hover:text-purple-600 transition">Programme</a>
                    <a href="#infos-pratiques" class="text-gray-700 hover:text-purple-600 transition">Infos pratiques</a>
                </div>
            </div>
        </div>
    </nav>

    <section class="gradient-bg text-white pt-32 pb-20">
        <div class="max-w-6xl mx-auto px-4 text-center">
            <h2 class="text-5xl font-bold mb-6">${hero.title || 'Titre par défaut'}</h2>
            <p class="text-xl mb-8 opacity-90">${hero.subtitle || ''}</p>
            <a href="#pourquoi-inscrire" class="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition inline-block">${hero.button_text || 'En savoir plus'}</a>
        </div>
    </section>

    <section id="qui-sommes-nous" class="py-20 section-spacing">
        <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-4xl font-bold text-center mb-16 text-gray-800">Qui sommes-nous ?</h2>
            <div class="grid md:grid-cols-2 gap-12 mb-16">
                <div class="bg-white p-8 rounded-lg shadow-lg">
                    <h3 class="text-2xl font-semibold mb-4 text-purple-600">Présentation de l'atelier</h3>
                    <p class="text-gray-700 leading-relaxed">${about.presentation || ''}</p>
                </div>
                <div class="bg-white p-8 rounded-lg shadow-lg">
                    <h3 class="text-2xl font-semibold mb-4 text-purple-600">Notre vision</h3>
                    <p class="text-gray-700 leading-relaxed">${about.vision || ''}</p>
                </div>
            </div>
        </div>
    </section>

    <section id="pourquoi-inscrire" class="py-20 bg-gray-50 section-spacing">
        <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-4xl font-bold text-center mb-16 text-gray-800">Pourquoi inscrire votre enfant ?</h2>
            <div class="mb-16">
                <h3 class="text-3xl font-semibold mb-8 text-center text-purple-600">Les bénéfices</h3>
                <div class="grid md:grid-cols-3 gap-8">
                    ${benefits.map(b => `
                    <div class="bg-white p-6 rounded-lg shadow-md text-center">
                        <div class="text-4xl mb-4">${b.emoji || '✨'}</div>
                        <h4 class="text-xl font-semibold mb-3">${b.title || ''}</h4>
                        <p class="text-gray-600">${b.description || ''}</p>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>

    <section id="programme" class="py-20 section-spacing">
        <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-4xl font-bold text-center mb-16 text-gray-800">Programme</h2>
            <div class="grid md:grid-cols-2 gap-12">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg shadow-lg">
                    <h3 class="text-3xl font-semibold mb-6 text-blue-700">Niveau Débutants</h3>
                    <div class="mb-8">
                        <h4 class="text-xl font-semibold mb-4 text-blue-600">Parcours d'apprentissage</h4>
                        <ul class="space-y-3 text-gray-700">
                            ${(progBegin.path || []).map(item => `
                            <li class="flex items-start">
                                <span class="text-blue-500 mr-2">•</span>
                                <span>${item}</span>
                            </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-xl font-semibold mb-4 text-blue-600">Exemples de projets</h4>
                        <div class="space-y-2 text-gray-700">
                            ${(progBegin.projects || []).map(p => `<p class="bg-white p-3 rounded">${p}</p>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg shadow-lg">
                    <h3 class="text-3xl font-semibold mb-6 text-purple-700">Niveau Avancés</h3>
                    <div class="mb-8">
                        <h4 class="text-xl font-semibold mb-4 text-purple-600">Parcours d'apprentissage</h4>
                        <ul class="space-y-3 text-gray-700">
                            ${(progAdv.path || []).map(item => `
                            <li class="flex items-start">
                                <span class="text-purple-500 mr-2">•</span>
                                <span>${item}</span>
                            </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-xl font-semibold mb-4 text-purple-600">Exemples de projets</h4>
                        <div class="space-y-2 text-gray-700">
                            ${(progAdv.projects || []).map(p => `<p class="bg-white p-3 rounded">${p}</p>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="infos-pratiques" class="py-20 bg-gray-50 section-spacing">
        <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-4xl font-bold text-center mb-16 text-gray-800">Infos pratiques</h2>
            <div class="grid md:grid-cols-2 gap-12">
                <div class="bg-white p-8 rounded-lg shadow-lg">
                    <h3 class="text-2xl font-semibold mb-6 text-purple-600">Organisation</h3>
                    <div class="space-y-4 text-gray-700">
                        ${org.schedule ? `<div><p class="font-semibold text-gray-800">📅 Horaires</p><p>${org.schedule.replace(/\n/g, '<br>')}</p></div>` : ''}
                        ${org.groups ? `<div><p class="font-semibold text-gray-800">👥 Groupes</p><p>${org.groups}</p></div>` : ''}
                        ${org.location ? `<div><p class="font-semibold text-gray-800">📍 Lieu</p><p>${org.location}</p></div>` : ''}
                        ${org.pricing ? `<div><p class="font-semibold text-gray-800">💰 Tarifs</p><p>${org.pricing}</p></div>` : ''}
                    </div>
                </div>
                <div class="bg-white p-8 rounded-lg shadow-lg">
                    <h3 class="text-2xl font-semibold mb-6 text-purple-600">Sécurité et matériel</h3>
                    <div class="space-y-4 text-gray-700">
                        ${sec.safety ? `<div><p class="font-semibold text-gray-800">🔒 Sécurité</p><p>${sec.safety.replace(/\n/g, '<br>')}</p></div>` : ''}
                        ${sec.equipment ? `<div><p class="font-semibold text-gray-800">💻 Matériel fourni</p><p>${sec.equipment.replace(/\n/g, '<br>')}</p></div>` : ''}
                        ${sec.resources ? `<div><p class="font-semibold text-gray-800">📚 Ressources</p><p>${sec.resources.replace(/\n/g, '<br>')}</p></div>` : ''}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer class="bg-gray-800 text-white py-12">
        <div class="max-w-6xl mx-auto px-4 text-center">
            <h3 class="text-2xl font-bold mb-4">Atelier Coding</h3>
            <p class="mb-6">Développer les compétences de demain, aujourd'hui</p>
            <p class="text-gray-400 text-sm">© 2024 Atelier Coding. Tous droits réservés.</p>
        </div>
    </footer>

    <script>
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    </script>
</body>
</html>`;
}

// Main
try {
    const { data } = loadContent('./public/content/pages/home.md');
    const html = generateHTML(data);
    fs.writeFileSync('./public/index.html', html);
    console.log('✅ index.html généré avec succès !');
} catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
}