const { chromium } = require('playwright');

async function debugLoginForm() {
    console.log('🔍 DEBUGGING LOGIN FORM STRUCTURE');
    console.log('=================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-web-security'] 
    });
    
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('🔐 Loading login page...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    console.log('📸 Taking screenshot of login page...');
    const loginScreenshot = `./testing/login-form-debug-${Date.now()}.png`;
    await page.screenshot({ 
        path: loginScreenshot, 
        fullPage: true 
    });
    console.log(`   Login form: ${loginScreenshot}`);
    
    console.log('🔍 Analyzing form structure...');
    
    const formAnalysis = await page.evaluate(() => {
        // Find all forms
        const forms = Array.from(document.querySelectorAll('form'));
        
        // Find all input fields
        const inputs = Array.from(document.querySelectorAll('input'));
        
        return {
            forms: forms.map(form => ({
                id: form.id,
                action: form.action,
                method: form.method,
                className: form.className
            })),
            inputs: inputs.map(input => ({
                type: input.type,
                name: input.name,
                id: input.id,
                placeholder: input.placeholder,
                value: input.value,
                className: input.className,
                visible: input.offsetParent !== null,
                rect: input.getBoundingClientRect(),
                labels: Array.from(document.querySelectorAll(`label[for="${input.id}"]`)).map(l => l.textContent)
            }))
        };
    });
    
    console.log('\\n📋 FORM ANALYSIS:');
    console.log('Forms found:', formAnalysis.forms.length);
    formAnalysis.forms.forEach((form, i) => {
        console.log(`   Form ${i + 1}:`, form);
    });
    
    console.log('\\n📝 INPUT ANALYSIS:');
    console.log('Inputs found:', formAnalysis.inputs.length);
    formAnalysis.inputs.forEach((input, i) => {
        console.log(`   Input ${i + 1}:`, {
            type: input.type,
            name: input.name,
            id: input.id,
            placeholder: input.placeholder,
            visible: input.visible,
            labels: input.labels
        });
    });
    
    // Try to identify username and password fields
    const usernameFields = formAnalysis.inputs.filter(input => 
        input.visible && (
            input.type === 'text' || 
            input.type === 'email' ||
            input.name.includes('user') ||
            input.name.includes('login') ||
            input.name.includes('email') ||
            input.placeholder?.toLowerCase().includes('user') ||
            input.placeholder?.toLowerCase().includes('email')
        )
    );
    
    const passwordFields = formAnalysis.inputs.filter(input => 
        input.visible && input.type === 'password'
    );
    
    console.log('\\n🎯 IDENTIFIED FIELDS:');
    console.log('Username candidates:', usernameFields.length);
    usernameFields.forEach((field, i) => {
        console.log(`   Username ${i + 1}:`, field.name, field.id, field.placeholder);
    });
    
    console.log('Password candidates:', passwordFields.length);
    passwordFields.forEach((field, i) => {
        console.log(`   Password ${i + 1}:`, field.name, field.id, field.placeholder);
    });
    
    await browser.close();
    
    return { formAnalysis, usernameFields, passwordFields };
}

debugLoginForm().catch(console.error);