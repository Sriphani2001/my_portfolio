document.addEventListener('DOMContentLoaded', () => {
  // --- Navigation & Scroll Effects ---
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Sticky Navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightNavLink();
  });

  // Active Nav Link Scrollspy
  function highlightNavLink() {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Mobile Menu Toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
  }

  // Close Mobile Menu on Link Click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // --- Particle Network Canvas ---
  const canvas = document.getElementById('network-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const maxParticles = 60;
    const connectionDistance = 120;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const mouse = {
      x: null,
      y: null,
      radius: 150
    };

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 2 + 1.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Boundary collision
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse attraction/repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= dx / distance * force * 0.8;
            this.y -= dy / distance * force * 0.8;
          }
        }
      }

      draw() {
        ctx.fillStyle = '#00f2fe';
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#00f2fe';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.22;
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
  }

  // --- Terminal Simulator Widget ---
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  
  if (terminalInput && terminalBody) {
    const welcomeLines = [
      "SecOps Terminal v1.4.2 Initialized.",
      "Profile: Sri Phani Deverakonda | Defensive Engineering Systems",
      "Type 'help' to display a list of available commands."
    ];

    welcomeLines.forEach(line => appendTerminalLine(line));

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = terminalInput.value.trim();
        terminalInput.value = '';
        if (command) {
          handleTerminalCommand(command);
        }
      }
    });

    function appendTerminalLine(text, className = '') {
      const line = document.createElement('div');
      line.className = `terminal-line ${className}`;
      line.innerHTML = text;
      terminalBody.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function handleTerminalCommand(cmd) {
      appendTerminalLine(`$ ${cmd}`, 'terminal-input-line');
      
      const args = cmd.toLowerCase().split(' ');
      const mainCmd = args[0];

      switch (mainCmd) {
        case 'help':
          appendTerminalLine(
            `Available Commands:<br>` +
            `  <span class="terminal-highlight">about</span>     - Brief biography and defensive engineering overview<br>` +
            `  <span class="terminal-highlight">skills</span>    - Categorized core technical expertise<br>` +
            `  <span class="terminal-highlight">projects</span>  - Review structured development portfolio<br>` +
            `  <span class="terminal-highlight">contact</span>   - Email, Github, and communication lines<br>` +
            `  <span class="terminal-highlight">triage</span>    - Check for active SOC alerts / simulation triggers<br>` +
            `  <span class="terminal-highlight">clear</span>     - Clear terminal logs`
          );
          break;
        case 'clear':
          terminalBody.innerHTML = '';
          break;
        case 'about':
          appendTerminalLine(
            `Sri Phani Deverakonda - Cybersecurity & Network Engineer.<br>` +
            `Focused on secure systems, network infrastructure, and intelligent threat detection.<br>` +
            `Core positioning: <span class="terminal-highlight">Security + Networks + Backend + AI = Defensive Engineering Systems</span>`
          );
          break;
        case 'skills':
          appendTerminalLine(
            `Core Skills Catalog:<br>` +
            `🔐 [Cybersecurity]   SIEM (Splunk), Alert Triage, Vulnerabilities (OWASP), Snort IDS<br>` +
            `🌐 [Networks]        OSPF, BGP, VLANs, Subnetting, Wireshark, VPN (IPsec), PKI<br>` +
            `⚙️ [Backend]         REST APIs, FastAPI, Session Encryption, Async Python<br>` +
            `🤖 [AI/ML]           Deep Learning (CNN/LSTM), LightGBM, SHAP Explainability`
          );
          break;
        case 'projects':
          appendTerminalLine(
            `Featured Repositories & Labs:<br>` +
            `1. <span class="terminal-highlight">HTTP DDoS Detection System</span> [Thesis] - ML + SHAP explainability pipeline<br>` +
            `2. <span class="terminal-highlight">Network Simulation</span> [Cisco] - Scalable subnet design & ACLs<br>` +
            `3. <span class="terminal-highlight">OpenStack Cloud Infrastructure</span> - Automated monitoring via Ansible & Prometheus<br>` +
            `4. <span class="terminal-highlight">Secure RBAC File System</span> - Async backend with client-server validation`
          );
          break;
        case 'contact':
          appendTerminalLine(
            `Communication Channels:<br>` +
            `  Email:  <span class="terminal-highlight">phanidatta0406@gmail.com</span><br>` +
            `  GitHub: <a href="https://github.com/Sriphani2001" target="_blank" class="terminal-highlight">github.com/Sriphani2001</a><br>` +
            `  Phone:  <span class="terminal-highlight">+46 705494589</span>`
          );
          break;
        case 'triage':
          appendTerminalLine(`Checking security logs...`);
          setTimeout(() => {
            appendTerminalLine(`[!] ALERT: 1 active threat detected in SIEM.`, 'soc-log-warn');
            appendTerminalLine(`Use the SOC Alert Simulator dashboard below to review and resolve the alert.`, 'terminal-highlight');
          }, 600);
          break;
        default:
          appendTerminalLine(`Command not recognized: '${cmd}'. Type <span class="terminal-highlight">help</span> for commands.`, 'soc-log-err');
      }
    }
  }

  // --- SOC Alert Triage Simulator ---
  const alertsList = document.getElementById('soc-alerts-list');
  const detailsPanel = document.getElementById('soc-details-panel');
  const socSimulator = document.querySelector('.soc-simulator');
  const triggerAlertBtn = document.getElementById('trigger-alert-btn');
  
  // Hardcoded Alerts Database
  const alertDatabase = [
    {
      id: 'ddos-http',
      name: 'HTTP Flood DDoS Detected',
      source: '192.168.10.154 -> 10.0.0.8',
      severity: 'high',
      status: 'active',
      desc: 'High rate of incoming HTTP POST requests detected on web server pool. Signatures match botnet patterns. Thesis defense metrics indicate 95%+ precision required.',
      logs: [
        '[17:42:01] IDS/Snort rule triggered: [HTTP_DDoS_Attack]',
        '[17:42:02] Requests spike: 4,500 req/sec from dynamic subnets',
        '[17:42:05] SHAP Analysis: User-Agent anomalies and high entropy rate (entropy=7.82)',
        '[17:42:08] Backend response latency increased to 3,200ms'
      ],
      mitigationCmd: 'iptables -A INPUT -p tcp --dport 80 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT',
      triageLogs: [
        'Inspecting HTTP header attributes...',
        'Anomaly detected in field "connection: keep-alive" combined with randomized URI strings.',
        'Feature weights matching classifier: LightGBM (weight=0.68), CNN-LSTM (weight=0.32).'
      ]
    },
    {
      id: 'port-scan',
      name: 'Nmap TCP SYN Port Scan',
      source: '185.220.101.4 -> Edge Router',
      severity: 'medium',
      status: 'active',
      desc: 'Sequential probes detected across multiple destination ports in less than 2 seconds. Sourced from known Tor exit node.',
      logs: [
        '[17:40:12] Firewall drop count spike on external interface (VLAN-10)',
        '[17:40:13] Snort alert: [SCAN SYN FIN]',
        '[17:40:15] Source identified as Tor exit gateway'
      ],
      mitigationCmd: 'iptables -A INPUT -s 185.220.101.4 -j DROP',
      triageLogs: [
        'Analyzing traffic packet captures via tcpdump...',
        'Identified scanning sequence: ports 21, 22, 23, 80, 443, 8080.',
        'No active service sockets exposed on these ports except SSH (keys only).'
      ]
    },
    {
      id: 'rbac-bypass',
      name: 'File System RBAC Violation',
      source: 'Internal User: dev_guest',
      severity: 'low',
      status: 'active',
      desc: 'Attempt to execute write commands in directory /secure_vault without cryptography keys. RBAC system blocked access.',
      logs: [
        '[17:35:50] Cryptography validation failure: invalid signature format',
        '[17:35:51] Security audit event: File system write denial',
        '[17:35:53] Authentication layer logged access failure'
      ],
      mitigationCmd: 'chmod 700 /secure_vault && fail2ban-client set file-rbac banip 10.0.2.15',
      triageLogs: [
        'Checking authorization token lifecycle...',
        'User token role: READ_ONLY. Requested action: WRITE.',
        'Cryptographic hashes compared and verified. System status: BLOCKED.'
      ]
    }
  ];

  let activeAlert = null;
  let triageStep = 0; // 0 = Idle, 1 = Triaged, 2 = Mitigating/Mitigated, 3 = Closed

  if (alertsList && detailsPanel) {
    function renderAlerts() {
      alertsList.innerHTML = '';
      alertDatabase.forEach((alert) => {
        const item = document.createElement('div');
        item.className = `soc-alert-item ${alert.status === 'resolved' ? 'resolved' : ''} ${activeAlert && activeAlert.id === alert.id ? 'active' : ''}`;
        
        let severityBadge = '';
        if (alert.status === 'resolved') {
          severityBadge = '<span class="soc-alert-badge badge-success">Resolved</span>';
        } else {
          severityBadge = `<span class="soc-alert-badge badge-${alert.severity}">${alert.severity}</span>`;
        }

        item.innerHTML = `
          <div class="soc-alert-info">
            <span class="soc-alert-name">${alert.name}</span>
            <span class="soc-alert-source">${alert.source}</span>
          </div>
          ${severityBadge}
        `;
        
        item.addEventListener('click', () => {
          selectAlert(alert);
        });

        alertsList.appendChild(item);
      });
      
      // Update general SOC status
      const activeCount = alertDatabase.filter(a => a.status === 'active').length;
      const statusText = document.getElementById('soc-status-text');
      if (activeCount > 0) {
        socSimulator.classList.add('under-attack');
        if (statusText) statusText.textContent = `${activeCount} SEC THREATS ACTIVE`;
      } else {
        socSimulator.classList.remove('under-attack');
        if (statusText) statusText.textContent = 'SYSTEM SECURE';
      }
    }

    function selectAlert(alert) {
      activeAlert = alert;
      triageStep = alert.status === 'resolved' ? 3 : 0;
      renderAlertDetails();
      renderAlerts();
    }

    function renderAlertDetails() {
      if (!activeAlert) {
        detailsPanel.innerHTML = `
          <div class="soc-details-empty">
            <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>SELECT A SIEM ALERT TO INITIATE TRIAGE WORKFLOW</span>
          </div>
        `;
        return;
      }

      const isResolved = activeAlert.status === 'resolved';

      detailsPanel.innerHTML = `
        <div class="soc-details-content">
          <div class="soc-detail-title-row">
            <h4 class="soc-detail-title">${activeAlert.name}</h4>
            <span class="soc-alert-badge badge-${isResolved ? 'success' : activeAlert.severity}">${isResolved ? 'Resolved' : activeAlert.severity}</span>
          </div>
          <p class="soc-detail-desc">${activeAlert.desc}</p>
          
          <div class="soc-log-console" id="soc-console">
            <!-- Simulated syslog terminal -->
            ${activeAlert.logs.map(log => `<div class="soc-log-line soc-log-err">${escapeHtml(log)}</div>`).join('')}
            ${triageStep >= 1 ? `<div class="soc-log-line soc-log-info">[TRIAGE INITIATED] Running forensic audit...</div>` + 
              activeAlert.triageLogs.map(l => `<div class="soc-log-line soc-log-info">>> ${escapeHtml(l)}</div>`).join('') : ''}
            ${triageStep >= 2 ? `<div class="soc-log-line soc-log-warn">[MITIGATION DEPLOYED] Applying filter rules...</div>` + 
              `<div class="soc-log-line soc-log-success">EXEC: ${escapeHtml(activeAlert.mitigationCmd)}</div>` +
              `<div class="soc-log-line soc-log-success">>> IP state synchronized. Port traffic quarantined.</div>` : ''}
            ${triageStep >= 3 ? `<div class="soc-log-line soc-log-success">[STATUS: RESOLVED] Threat neutralized. SOC Analyst closed case.</div>` : ''}
          </div>
          
          <div class="soc-action-bar">
            <button class="soc-btn-action" id="btn-triage-step" ${triageStep > 0 ? 'disabled' : ''}>
              🔍 Analyze Logs
            </button>
            <button class="soc-btn-action" id="btn-mitigate-step" ${triageStep !== 1 ? 'disabled' : ''}>
              🛡️ Deploy Rules
            </button>
            <button class="soc-btn-action" id="btn-close-step" ${triageStep !== 2 ? 'disabled' : ''}>
              ✅ Close Alert
            </button>
          </div>
        </div>
      `;

      // Scroll console to bottom
      const consoleEl = document.getElementById('soc-console');
      if (consoleEl) consoleEl.scrollTop = consoleEl.scrollHeight;

      // Event Listeners for Triage Steps
      const btnTriage = document.getElementById('btn-triage-step');
      const btnMitigate = document.getElementById('btn-mitigate-step');
      const btnClose = document.getElementById('btn-close-step');

      if (btnTriage) {
        btnTriage.addEventListener('click', () => {
          triageStep = 1;
          renderAlertDetails();
        });
      }

      if (btnMitigate) {
        btnMitigate.addEventListener('click', () => {
          triageStep = 2;
          renderAlertDetails();
        });
      }

      if (btnClose) {
        btnClose.addEventListener('click', () => {
          triageStep = 3;
          activeAlert.status = 'resolved';
          renderAlertDetails();
          renderAlerts();
        });
      }
    }

    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    // Trigger new alert button listener
    if (triggerAlertBtn) {
      triggerAlertBtn.addEventListener('click', () => {
        // Reset all resolved items to active to demonstrate again
        alertDatabase.forEach(a => a.status = 'active');
        activeAlert = alertDatabase[0];
        triageStep = 0;
        renderAlerts();
        renderAlertDetails();
      });
    }

    // Initial render of alerts
    renderAlerts();
  }

  // --- Project Filter System ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Active tab switch
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const type = card.getAttribute('data-type');
          
          if (filterValue === 'all' || type === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 200); // match transition speed
          }
        });
      });
    });
  }

  // --- Skill Bars Animation ---
  const skillsSection = document.getElementById('skills');
  const progressBars = document.querySelectorAll('.skill-bar-fill');

  function animateSkills() {
    if (!skillsSection) return;
    const sectionPos = skillsSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.1;

    if (sectionPos < screenPos) {
      progressBars.forEach(bar => {
        const value = bar.getAttribute('data-percentage');
        bar.style.width = `${value}%`;
      });
      // Remove event listener once animated
      window.removeEventListener('scroll', animateSkills);
    }
  }

  window.addEventListener('scroll', animateSkills);
  animateSkills(); // check on load

  // --- Contact Form Submission Simulation ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="svg-icon" style="animation: spin 1s linear infinite;" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="32" />
        </svg> Sending Secure Msg...
      `;

      // CSS spin animation inject
      const style = document.createElement('style');
      style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
      document.head.appendChild(style);

      setTimeout(() => {
        // Success response
        submitBtn.innerHTML = '✅ Encrypted Message Transmitted!';
        submitBtn.style.background = 'linear-gradient(135deg, #05ffc5, #3b82f6)';
        submitBtn.style.color = '#060913';
        
        // Save to local storage for interactive demo
        const msgData = {
          name: document.getElementById('form-name').value,
          email: document.getElementById('form-email').value,
          subject: document.getElementById('form-subject').value,
          message: document.getElementById('form-message').value,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('last_contact_msg', JSON.stringify(msgData));

        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }, 3000);

      }, 1800);
    });
  }
});
