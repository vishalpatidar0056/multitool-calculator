// ==========================================
// 1. ISOLATED THEME TOGGLE (Standardized)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (themeToggle && themeIcon) {
        if (localStorage.getItem('multitool-theme') === 'light') {
            document.body.classList.add('light-theme');
            themeIcon.src = '../icons/dark-mode.png';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            
            if (isLight) {
                themeIcon.src = '../icons/dark-mode.png'; 
                localStorage.setItem('multitool-theme', 'light');
            } else {
                themeIcon.src = '../icons/light-mode.png'; 
                localStorage.setItem('multitool-theme', 'dark');
            }
        });
    }
});

// ==========================================
// 2. XML FORMATTER ENGINE
// ==========================================
const btnFormat = document.getElementById('btn-format');
const btnClear = document.getElementById('btn-clear');
const xmlInput = document.getElementById('xml-input');
const xmlOutput = document.getElementById('xml-output');
const errorBox = document.getElementById('error-msg');

function formatXML(xml) {
    let formatted = '';
    let pad = 0;
    
    // First, remove existing whitespace and newlines between tags to standardize it
    xml = xml.replace(/(>)\s*(<)/g, "$1\n$2");
    
    // Split the XML into an array by lines
    const lines = xml.split('\n');
    
    lines.forEach((node) => {
        let indent = 0;
        
        // If it's a closing tag, decrease padding
        if (node.match(/^<\/(.*)>/)) {
            if (pad > 0) pad -= 1;
        } 
        // If it's an opening tag (not self-closing, not a comment, not XML declaration)
        else if (node.match(/^<(.*)>$/) && !node.match(/<\/(.*)>$/) && !node.match(/\/>$/) && !node.match(/^<!--/) && !node.match(/^<\?/)) {
            indent = 1;
        }
        
        // Apply 4 spaces of padding multiplied by the current depth
        formatted += '    '.repeat(pad) + node + '\n';
        pad += indent;
    });
    
    return formatted.trim();
}

btnFormat.addEventListener('click', () => {
    const rawData = xmlInput.value.trim();
    
    // Reset Error Box
    errorBox.style.display = 'none';
    errorBox.innerText = '';

    if (!rawData) {
        xmlOutput.value = "";
        return;
    }

    try {
        // Step 1: Validate using the browser's native XML parser
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rawData, "application/xml");
        const parseError = xmlDoc.getElementsByTagName("parsererror");

        if (parseError.length > 0) {
            // Extract a cleaner error message
            const errorString = parseError[0].textContent.split('\n')[0];
            throw new Error(errorString);
        }
        
        // Step 2: Format the validated XML
        const beautifiedXML = formatXML(rawData);
        
        // Display the result
        xmlOutput.value = beautifiedXML;
        
    } catch (error) {
        // Display the error
        xmlOutput.value = "";
        errorBox.innerText = `Invalid XML: ${error.message}`;
        errorBox.style.display = 'block';
        
        setTimeout(() => {
            errorBox.style.display = 'none';
        }, 5000);
    }
});

// Clear input and output
btnClear.addEventListener('click', () => {
    xmlInput.value = "";
    xmlOutput.value = "";
    errorBox.style.display = 'none';
    xmlInput.focus();
});

// ==========================================
// 3. COPY TO CLIPBOARD LOGIC
// ==========================================
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-copy');
        const inputElement = document.getElementById(targetId);
        
        if (!inputElement.value) return; 

        inputElement.select();
        inputElement.setSelectionRange(0, 999999); 
        navigator.clipboard.writeText(inputElement.value);

        const originalText = btn.innerText;
        btn.innerText = "Copied!";
        btn.classList.add('success'); 
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('success');
        }, 2000);
    });
});