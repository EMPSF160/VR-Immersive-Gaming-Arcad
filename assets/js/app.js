/**
 * NEXUS VR & AUDIO ARCADE - APPLICATION ENGINE
 * Features:
 * - Reactive Booking Workflow & Live Pricing Engine
 * - Web Audio API Spatial Sound Synthesizer & Canvas Visualizer
 * - Gear Rental Catalog & Interactive Slideout Cart
 * - Client-Side Authentication (Login, Register, Forgot Password)
 * - Admin Management Dashboard (Live Bookings, Station Status, Inventory)
 * - Strict Requirements Handling (Clickable Logos -> Home, Social Links, Favicon)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- APPLICATION STATE ---
  const state = {
    currentUser: null, // null or { name: 'Alex Mercer', email: 'alex@creatorlab.com', role: 'creator' }
    cart: [],
    stations: [
      { id: 'holo-arena', name: 'Omni Free-Roam Holo-Arena', basePrice: 45, unit: 'per person/hr', status: 'available' },
      { id: 'racing-sim', name: 'Hyper-Drive F1 Motion Rig', basePrice: 55, unit: 'per hour', status: 'available' },
      { id: 'zerog-pod', name: 'Zero-G Flight & Space Pod', basePrice: 50, unit: 'per hour', status: 'in-session' },
      { id: 'podcast-suite', name: 'Pro Broadcast Podcast Suite', basePrice: 65, unit: 'per hour', status: 'available' },
      { id: 'escape-lab', name: 'Spatial Cyber-Escape Lab', basePrice: 40, unit: 'per person/hr', status: 'maintenance' }
    ],
    selectedStation: 'holo-arena',
    selectedDate: new Date().toISOString().split('T')[0],
    selectedTime: '02:30 PM',
    selectedDuration: 1, // hours
    selectedAddons: ['shure-mic'],
    bookings: [
      { id: 'NX-9421', customer: 'Marcus Vance', station: 'Omni Free-Roam Holo-Arena', gear: 'Shure SM7B + Haptic Suit', date: 'Today, 02:30 PM', duration: '1 hr', total: 70, status: 'Confirmed' },
      { id: 'NX-9422', customer: 'Elena Rostova', station: 'Pro Broadcast Podcast Suite', gear: 'Rodecaster Pro II + 2x Mics', date: 'Today, 04:00 PM', duration: '2 hrs', total: 175, status: 'Confirmed' },
      { id: 'NX-9423', customer: 'David Chen', station: 'Hyper-Drive F1 Motion Rig', gear: 'Spatial Haptic VR Headset', date: 'Today, 06:30 PM', duration: '1 hr', total: 65, status: 'In Session' },
      { id: 'NX-9424', customer: 'TechPulse Media', station: 'Pro Broadcast Podcast Suite', gear: 'Full Studio Rig + 4K Stream Cam', date: 'Tomorrow, 11:00 AM', duration: '3 hrs', total: 280, status: 'Confirmed' }
    ],
    gearCatalog: [
      { id: 'gear-1', name: 'Shure SM7B Broadcast Mic', category: 'microphones', price: 18, icon: '🎙️', desc: 'Cardioid studio microphone renowned for pristine vocal capture and electromagnetic shielding.' },
      { id: 'gear-2', name: 'RØDECaster Pro II Console', category: 'consoles', price: 28, icon: '🎛️', desc: 'Integrated audio production studio with 4 high-gain Revolution Preamps and customizable SMART pads.' },
      { id: 'gear-3', name: 'Audeze Planar Haptic VR Headset', category: 'monitoring', price: 22, icon: '🎧', desc: 'Ultra-low latency planar magnetic drivers with haptic sub-bass feedback for pinpoint 3D spatial cues.' },
      { id: 'gear-4', name: 'Electro-Voice RE20 Dynamic Mic', category: 'microphones', price: 20, icon: '🎙️', desc: 'Industry standard broadcast condenser-like tone with Variable-D proximity control.' },
      { id: 'gear-5', name: 'Universal Audio Apollo Twin X', category: 'consoles', price: 25, icon: '⚡', desc: 'Elite audio conversion with real-time UAD DUO Core processing and Unison mic preamps.' },
      { id: 'gear-6', name: 'Elgato Stream Deck XL', category: 'streaming', price: 15, icon: '🕹️', desc: '32 customizable LCD keys for instantaneous scene switching, audio drops, and lighting macro triggers.' },
      { id: 'gear-7', name: 'Sony FX3 4K Cinema Camera Rig', category: 'streaming', price: 45, icon: '🎥', desc: 'Full-frame 4K 120p broadcast camera rigged on counter-balanced boom arm for studio podcasts.' },
      { id: 'gear-8', name: 'Sennheiser MKH 416 Shotgun Mic', category: 'microphones', price: 22, icon: '🎯', desc: 'Interference tube condenser mic delivering razor-sharp directional speech clarity.' }
    ]
  };

  // --- AUDIO SYNTHESIZER ENGINE (Web Audio API) ---
  let audioCtx = null;
  let synthOscillator = null;
  let synthGain = null;
  let synthPanner = null;
  let synthFilter = null;
  let analyserNode = null;
  let isAudioPlaying = false;
  let animFrameId = null;

  // Initialize Web Audio Engine
  function initAudioLab() {
    const playBtn = document.getElementById('toggle-audio-synth');
    const canvas = document.getElementById('audio-visualizer-canvas');
    if (!playBtn || !canvas) return;

    const ctx2d = canvas.getContext('2d');

    playBtn.addEventListener('click', () => {
      if (!isAudioPlaying) {
        startSynthesizer();
        playBtn.innerHTML = '<span>⏸ Pause Audio Demo</span>';
        playBtn.classList.replace('btn-secondary', 'btn-pink');
      } else {
        stopSynthesizer();
        playBtn.innerHTML = '<span>▶ Activate Spatial Audio Lab</span>';
        playBtn.classList.replace('btn-pink', 'btn-secondary');
      }
    });

    function startSynthesizer() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        // Oscillator with cyber chord harmonics
        synthOscillator = audioCtx.createOscillator();
        synthOscillator.type = 'sawtooth';
        synthOscillator.frequency.setValueAtTime(110, audioCtx.currentTime); // Low A

        // Filter
        synthFilter = audioCtx.createBiquadFilter();
        synthFilter.type = 'lowpass';
        const cutoffVal = document.getElementById('filter-slider') ? parseFloat(document.getElementById('filter-slider').value) : 1200;
        synthFilter.frequency.setValueAtTime(cutoffVal, audioCtx.currentTime);

        // Panner (Stereo spatial audio)
        if (audioCtx.createStereoPanner) {
          synthPanner = audioCtx.createStereoPanner();
          const panVal = document.getElementById('pan-slider') ? parseFloat(document.getElementById('pan-slider').value) : 0;
          synthPanner.pan.setValueAtTime(panVal, audioCtx.currentTime);
        }

        // Master Gain
        synthGain = audioCtx.createGain();
        const volVal = document.getElementById('vol-slider') ? parseFloat(document.getElementById('vol-slider').value) : 0.4;
        synthGain.gain.setValueAtTime(volVal, audioCtx.currentTime);

        // Analyser for real-time visualizer
        analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = 64;

        // Routing
        synthOscillator.connect(synthFilter);
        if (synthPanner) {
          synthFilter.connect(synthPanner);
          synthPanner.connect(synthGain);
        } else {
          synthFilter.connect(synthGain);
        }
        synthGain.connect(analyserNode);
        analyserNode.connect(audioCtx.destination);

        synthOscillator.start();
        isAudioPlaying = true;
        renderVisualizer();
        showToast('Spatial Audio Synth Activated', 'info');
      } catch (err) {
        console.warn('AudioContext error:', err);
        showToast('Audio preview active in simulated mode', 'info');
        isAudioPlaying = true;
        renderSimulatedVisualizer();
      }
    }

    function stopSynthesizer() {
      if (synthOscillator) {
        try { synthOscillator.stop(); } catch(e) {}
      }
      if (audioCtx) {
        try { audioCtx.close(); } catch(e) {}
      }
      isAudioPlaying = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      // Clear visualizer to idle grid
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      drawIdleGrid(ctx2d, canvas);
    }

    // Dynamic sliders listener
    const volSlider = document.getElementById('vol-slider');
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (synthGain && audioCtx) {
          synthGain.gain.setValueAtTime(val, audioCtx.currentTime);
        }
        const valDisplay = document.getElementById('vol-val');
        if (valDisplay) valDisplay.textContent = `${Math.round(val * 100)}%`;
      });
    }

    const panSlider = document.getElementById('pan-slider');
    if (panSlider) {
      panSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (synthPanner && audioCtx) {
          synthPanner.pan.setValueAtTime(val, audioCtx.currentTime);
        }
        const valDisplay = document.getElementById('pan-val');
        if (valDisplay) {
          valDisplay.textContent = val === 0 ? 'Center' : val < 0 ? `${Math.abs(Math.round(val * 100))}% Left` : `${Math.round(val * 100)}% Right`;
        }
      });
    }

    const filterSlider = document.getElementById('filter-slider');
    if (filterSlider) {
      filterSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (synthFilter && audioCtx) {
          synthFilter.frequency.setValueAtTime(val, audioCtx.currentTime);
        }
        const valDisplay = document.getElementById('filter-val');
        if (valDisplay) valDisplay.textContent = `${Math.round(val)} Hz`;
      });
    }

    // Studio filter buttons
    document.querySelectorAll('.filter-profile-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-profile-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.mode;
        if (synthOscillator && synthFilter && audioCtx) {
          if (mode === 'podcast') {
            synthOscillator.type = 'sine';
            synthFilter.frequency.setValueAtTime(3200, audioCtx.currentTime);
            showToast('Active Profile: Studio Podcast Broadcast Mode', 'info');
          } else if (mode === 'vr-haptic') {
            synthOscillator.type = 'sawtooth';
            synthFilter.frequency.setValueAtTime(650, audioCtx.currentTime);
            showToast('Active Profile: Sub-Bass VR Haptic Rumble', 'info');
          } else {
            synthOscillator.type = 'triangle';
            synthFilter.frequency.setValueAtTime(1800, audioCtx.currentTime);
            showToast('Active Profile: Neutral Hi-Fi Spatial Acoustic', 'info');
          }
        }
      });
    });

    function renderVisualizer() {
      if (!isAudioPlaying || !analyserNode) return;
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserNode.getByteFrequencyData(dataArray);

      ctx2d.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.8;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * (canvas.height * 0.85);

        // Cyber gradient bar
        const gradient = ctx2d.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#00f3ff');
        gradient.addColorStop(0.5, '#b026ff');
        gradient.addColorStop(1, '#ff007f');

        ctx2d.fillStyle = gradient;
        ctx2d.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        // Cap dot
        ctx2d.fillStyle = '#ffffff';
        ctx2d.fillRect(x, canvas.height - barHeight - 3, barWidth - 2, 2);

        x += barWidth;
      }
      animFrameId = requestAnimationFrame(renderVisualizer);
    }

    function renderSimulatedVisualizer() {
      if (!isAudioPlaying) return;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 32;
      const barWidth = canvas.width / barCount;

      for (let i = 0; i < barCount; i++) {
        const height = Math.abs(Math.sin(Date.now() * 0.005 + i * 0.3)) * (canvas.height * 0.8) + 10;
        const gradient = ctx2d.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#00f3ff');
        gradient.addColorStop(0.6, '#b026ff');
        gradient.addColorStop(1, '#ff007f');
        ctx2d.fillStyle = gradient;
        ctx2d.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
      }
      animFrameId = requestAnimationFrame(renderSimulatedVisualizer);
    }

    function drawIdleGrid(ctx, c) {
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < c.width; x += 25) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, c.height);
      }
      for (let y = 0; y < c.height; y += 25) {
        ctx.moveTo(0, y);
        ctx.lineTo(c.width, y);
      }
      ctx.stroke();

      // Idle center wave line
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, c.height / 2);
      ctx.lineTo(c.width, c.height / 2);
      ctx.stroke();
    }

    // Set canvas dimensions & draw idle line initially
    canvas.width = canvas.parentElement.clientWidth || 800;
    canvas.height = 140;
    drawIdleGrid(ctx2d, canvas);
  }

  // --- INTERACTIVE BOOKING WORKFLOW ENGINE ---
  function initBookingEngine() {
    const stationTiles = document.querySelectorAll('.station-option-tile');
    const timeSlots = document.querySelectorAll('.time-slot-pill');
    const durationSelect = document.getElementById('booking-duration-select');
    const dateInput = document.getElementById('booking-date-input');
    const addonItems = document.querySelectorAll('.addon-item');
    const confirmBtn = document.getElementById('btn-confirm-booking');

    // Default date to today
    if (dateInput) {
      dateInput.value = state.selectedDate;
      dateInput.min = new Date().toISOString().split('T')[0];
      dateInput.addEventListener('change', (e) => {
        state.selectedDate = e.target.value;
        updateSummary();
      });
    }

    // Station selection
    stationTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        stationTiles.forEach(t => t.classList.remove('selected'));
        tile.classList.add('selected');
        state.selectedStation = tile.dataset.stationId;
        updateSummary();
      });
    });

    // Time slot selection
    timeSlots.forEach(slot => {
      slot.addEventListener('click', () => {
        timeSlots.forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        state.selectedTime = slot.textContent.trim();
        updateSummary();
      });
    });

    // Duration change
    if (durationSelect) {
      durationSelect.addEventListener('change', (e) => {
        state.selectedDuration = parseFloat(e.target.value);
        updateSummary();
      });
    }

    // Addons checkboxes
    addonItems.forEach(item => {
      const checkbox = item.querySelector('.addon-checkbox');
      item.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        item.classList.toggle('selected', checkbox.checked);
        const addonId = item.dataset.addonId;
        if (checkbox.checked) {
          if (!state.selectedAddons.includes(addonId)) state.selectedAddons.push(addonId);
        } else {
          state.selectedAddons = state.selectedAddons.filter(id => id !== addonId);
        }
        updateSummary();
      });
    });

    // Quick book station buttons from experiences section
    document.querySelectorAll('.btn-quick-book-station').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetStationId = btn.dataset.stationId;
        const matchingTile = document.querySelector(`.station-option-tile[data-station-id="${targetStationId}"]`);
        if (matchingTile) {
          stationTiles.forEach(t => t.classList.remove('selected'));
          matchingTile.classList.add('selected');
          state.selectedStation = targetStationId;
          updateSummary();
        }
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    function calculateTotal() {
      const station = state.stations.find(s => s.id === state.selectedStation) || state.stations[0];
      const stationCost = station.basePrice * state.selectedDuration;
      let addonCost = 0;
      if (state.selectedAddons.includes('shure-mic')) addonCost += 15;
      if (state.selectedAddons.includes('rodecaster')) addonCost += 25;
      if (state.selectedAddons.includes('haptic-headset')) addonCost += 10;
      if (state.selectedAddons.includes('stream-deck')) addonCost += 15;
      if (state.selectedAddons.includes('video-recording')) addonCost += 35;
      return { station, stationCost, addonCost, total: stationCost + addonCost };
    }

    function updateSummary() {
      const { station, stationCost, addonCost, total } = calculateTotal();
      const stationDisplay = document.getElementById('summary-station-name');
      const timeDisplay = document.getElementById('summary-datetime-display');
      const durationDisplay = document.getElementById('summary-duration-display');
      const subtotalStation = document.getElementById('summary-station-price');
      const subtotalAddons = document.getElementById('summary-addons-price');
      const totalDisplay = document.getElementById('summary-total-price');

      if (stationDisplay) stationDisplay.textContent = station.name;
      if (timeDisplay) timeDisplay.textContent = `${state.selectedDate} at ${state.selectedTime}`;
      if (durationDisplay) durationDisplay.textContent = `${state.selectedDuration} Hour${state.selectedDuration > 1 ? 's' : ''}`;
      if (subtotalStation) subtotalStation.textContent = `$${stationCost}`;
      if (subtotalAddons) subtotalAddons.textContent = `$${addonCost}`;
      if (totalDisplay) totalDisplay.textContent = `$${total}`;
    }

    // Reservation confirmation button handler
    if (confirmBtn) {
      confirmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const { station, total } = calculateTotal();
        const bookingRef = `NX-${Math.floor(1000 + Math.random() * 9000)}`;
        const customerName = state.currentUser ? state.currentUser.name : (prompt('Enter reservation lead name:', 'Alex Mercer') || 'Guest Player');

        // Add to active state bookings list
        const newBooking = {
          id: bookingRef,
          customer: customerName,
          station: station.name,
          gear: state.selectedAddons.length > 0 ? `${state.selectedAddons.length} Pro Gear Items` : 'Standard Station Rig',
          date: `${state.selectedDate}, ${state.selectedTime}`,
          duration: `${state.selectedDuration} hr${state.selectedDuration > 1 ? 's' : ''}`,
          total: total,
          status: 'Confirmed'
        };

        state.bookings.unshift(newBooking);
        renderAdminBookingsTable();
        updateAdminKPIs();

        // Show realistic Confirmation Modal
        showBookingSuccessModal(newBooking);
      });
    }

    // Initialize summary
    updateSummary();
  }

  function showBookingSuccessModal(booking) {
    const modal = document.getElementById('booking-confirmation-modal');
    if (!modal) {
      showToast(`Booking ${booking.id} Confirmed for ${booking.customer}!`, 'success');
      return;
    }
    document.getElementById('modal-booking-ref').textContent = booking.id;
    document.getElementById('modal-booking-station').textContent = booking.station;
    document.getElementById('modal-booking-datetime').textContent = booking.date;
    document.getElementById('modal-booking-total').textContent = `$${booking.total}`;
    modal.classList.add('active');
  }

  // --- GEAR CATALOG & CART ENGINE ---
  function initGearShop() {
    const gearGrid = document.getElementById('gear-items-grid');
    const filterButtons = document.querySelectorAll('.gear-filter-btn');
    const cartToggleBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartDrawer = document.getElementById('cart-drawer-backdrop');
    const checkoutBtn = document.getElementById('btn-checkout-cart');

    // Render gear items
    function renderGear(category = 'all') {
      if (!gearGrid) return;
      gearGrid.innerHTML = '';
      const items = category === 'all' ? state.gearCatalog : state.gearCatalog.filter(g => g.category === category);

      items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'gear-card';
        card.innerHTML = `
          <div class="gear-icon-header">
            <span class="gear-category-badge">${item.category}</span>
            <span class="gear-hardware-icon">${item.icon}</span>
          </div>
          <h3 class="gear-name">${item.name}</h3>
          <p class="gear-specs">${item.desc}</p>
          <div class="gear-meta-row">
            <div>
              <span class="gear-price">$${item.price}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">/session</span>
            </div>
            <button class="btn btn-sm btn-secondary btn-add-gear" data-gear-id="${item.id}">
              <span>+ Add Gear</span>
            </button>
          </div>
        `;
        gearGrid.appendChild(card);
      });

      // Attach add-to-cart handlers
      document.querySelectorAll('.btn-add-gear').forEach(btn => {
        btn.addEventListener('click', () => {
          const gearId = btn.dataset.gearId;
          const found = state.gearCatalog.find(g => g.id === gearId);
          if (found) {
            addToCart(found);
          }
        });
      });
    }

    // Filter listeners
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGear(btn.dataset.category);
      });
    });

    // Add to cart helper
    function addToCart(item) {
      const existing = state.cart.find(c => c.id === item.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.cart.push({ ...item, qty: 1 });
      }
      updateCartUI();
      showToast(`Added ${item.name} to Gear Cart`, 'success');
    }

    function updateCartUI() {
      const cartBadge = document.getElementById('cart-count-badge');
      const cartItemsContainer = document.getElementById('cart-items-container');
      const subtotalDisplay = document.getElementById('cart-subtotal-price');
      const totalDisplay = document.getElementById('cart-total-price');

      const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
      if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
      }

      if (cartItemsContainer) {
        if (state.cart.length === 0) {
          cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
              <div style="font-size: 3rem; margin-bottom: 0.8rem;">🎧</div>
              <p>Your gear rental cart is currently empty.</p>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.4rem;">Browse our broadcast mics, audio mixers, and VR haptics above.</p>
            </div>
          `;
        } else {
          cartItemsContainer.innerHTML = '';
          state.cart.forEach(item => {
            const itemRow = document.createElement('div');
            itemRow.className = 'cart-item-row';
            itemRow.innerHTML = `
              <div>
                <div style="font-weight: 700; font-size: 0.92rem; color: #ffffff;">${item.name}</div>
                <div style="font-size: 0.8rem; color: var(--neon-cyan);">$${item.price} x ${item.qty} = $${item.price * item.qty}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <button class="btn btn-sm btn-secondary btn-cart-minus" data-id="${item.id}" style="padding: 0.2rem 0.6rem;">-</button>
                <span style="font-weight: 700; min-width: 20px; text-align: center;">${item.qty}</span>
                <button class="btn btn-sm btn-secondary btn-cart-plus" data-id="${item.id}" style="padding: 0.2rem 0.6rem;">+</button>
              </div>
            `;
            cartItemsContainer.appendChild(itemRow);
          });

          // Attach quantity handlers
          document.querySelectorAll('.btn-cart-minus').forEach(b => {
            b.addEventListener('click', () => {
              const id = b.dataset.id;
              const item = state.cart.find(c => c.id === id);
              if (item) {
                item.qty -= 1;
                if (item.qty <= 0) state.cart = state.cart.filter(c => c.id !== id);
                updateCartUI();
              }
            });
          });

          document.querySelectorAll('.btn-cart-plus').forEach(b => {
            b.addEventListener('click', () => {
              const id = b.dataset.id;
              const item = state.cart.find(c => c.id === id);
              if (item) {
                item.qty += 1;
                updateCartUI();
              }
            });
          });
        }
      }

      const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const tax = Math.round(subtotal * 0.08);
      if (subtotalDisplay) subtotalDisplay.textContent = `$${subtotal}`;
      if (totalDisplay) totalDisplay.textContent = `$${subtotal + tax}`;
    }

    if (cartToggleBtn && cartDrawer) {
      cartToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cartDrawer.classList.add('active');
      });
    }

    if (closeCartBtn && cartDrawer) {
      closeCartBtn.addEventListener('click', () => {
        cartDrawer.classList.remove('active');
      });
    }

    if (cartDrawer) {
      cartDrawer.addEventListener('click', (e) => {
        if (e.target === cartDrawer) cartDrawer.classList.remove('active');
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (state.cart.length === 0) {
          showToast('Please add items to your cart first', 'warning');
          return;
        }
        const orderId = `CART-${Math.floor(1000 + Math.random() * 9000)}`;
        showToast(`Order ${orderId} reserved successfully! Pick up at Studio Tech Desk.`, 'success');
        state.cart = [];
        updateCartUI();
        if (cartDrawer) cartDrawer.classList.remove('active');
      });
    }

    // Initial render
    renderGear('all');
    updateCartUI();
  }

  // --- USER AUTHENTICATION & STRICT MODAL REQUIREMENTS ---
  function initAuth() {
    const authBackdrop = document.getElementById('auth-modal-backdrop');
    const openAuthBtns = document.querySelectorAll('.btn-open-auth');
    const closeAuthBtn = document.getElementById('auth-modal-close-btn');
    const authTabs = document.querySelectorAll('.auth-tab-btn');
    const authForms = document.querySelectorAll('.auth-form-panel');
    const logoLinks = document.querySelectorAll('.auth-card-logo-link');

    // Strict Requirement 3: Logo inside auth cards must navigate to Home
    logoLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (authBackdrop) authBackdrop.classList.remove('active');
        window.location.hash = '#home';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast('Navigated to Home', 'info');
      });
    });

    openAuthBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (state.currentUser) {
          // If already logged in, show options or log out
          if (confirm(`Logged in as ${state.currentUser.name} (${state.currentUser.role}). Do you want to log out?`)) {
            state.currentUser = null;
            updateUserNav();
            showToast('Logged out successfully', 'info');
          }
          return;
        }
        if (authBackdrop) authBackdrop.classList.add('active');
      });
    });

    if (closeAuthBtn && authBackdrop) {
      closeAuthBtn.addEventListener('click', () => {
        authBackdrop.classList.remove('active');
      });
    }

    if (authBackdrop) {
      authBackdrop.addEventListener('click', (e) => {
        if (e.target === authBackdrop) authBackdrop.classList.remove('active');
      });
    }

    // Tab switching: Login / Register / Forgot Password
    authTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.style.display = 'none');
        tab.classList.add('active');
        const targetFormId = tab.dataset.targetForm;
        const targetForm = document.getElementById(targetFormId);
        if (targetForm) targetForm.style.display = 'flex';
      });
    });

    // Password visibility toggle
    document.querySelectorAll('.pwd-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        if (input && input.type === 'password') {
          input.type = 'text';
          btn.textContent = '🔒';
        } else if (input) {
          input.type = 'password';
          btn.textContent = '👁️';
        }
      });
    });

    // Demo Fill Shortcuts
    const demoCreatorBtn = document.getElementById('btn-demo-creator');
    const demoAdminBtn = document.getElementById('btn-demo-admin');

    if (demoCreatorBtn) {
      demoCreatorBtn.addEventListener('click', () => {
        document.getElementById('login-email').value = 'alex.mercer@creatorpod.io';
        document.getElementById('login-pwd').value = 'CyberPod2026!';
        showToast('Auto-filled Creator credentials', 'info');
      });
    }

    if (demoAdminBtn) {
      demoAdminBtn.addEventListener('click', () => {
        document.getElementById('login-email').value = 'admin@nexusvr.io';
        document.getElementById('login-pwd').value = 'MasterOmniControl99';
        showToast('Auto-filled Arcade Admin credentials', 'info');
      });
    }

    // Form Submissions
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const isAdmin = email.toLowerCase().includes('admin');

        state.currentUser = {
          name: isAdmin ? 'Admin Commander' : 'Alex Mercer',
          email: email,
          role: isAdmin ? 'admin' : 'creator'
        };

        updateUserNav();
        if (authBackdrop) authBackdrop.classList.remove('active');
        showToast(`Welcome back, ${state.currentUser.name}!`, 'success');

        if (isAdmin) {
          activateAdminSection();
        }
      });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();

        state.currentUser = {
          name: name || 'Valued Creator',
          email: email,
          role: 'creator'
        };

        updateUserNav();
        if (authBackdrop) authBackdrop.classList.remove('active');
        showToast(`Account created! Welcome to Nexus VR, ${state.currentUser.name}.`, 'success');
      });
    }

    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value.trim();
        showToast(`Password recovery link dispatched to ${email}`, 'info');
        // Switch back to login tab
        document.querySelector('.auth-tab-btn[data-target-form="login-form-panel"]').click();
      });
    }

    function updateUserNav() {
      const authBtnText = document.getElementById('nav-user-label');
      const userDot = document.getElementById('nav-user-dot');
      const adminNavBtn = document.getElementById('nav-admin-toggle');

      if (state.currentUser) {
        if (authBtnText) authBtnText.textContent = `${state.currentUser.name} (${state.currentUser.role.toUpperCase()})`;
        if (userDot) userDot.style.background = state.currentUser.role === 'admin' ? 'var(--neon-pink)' : 'var(--neon-green)';
        if (adminNavBtn) adminNavBtn.style.display = 'inline-flex';
      } else {
        if (authBtnText) authBtnText.textContent = 'Sign In / Register';
        if (userDot) userDot.style.background = 'var(--neon-cyan)';
      }
    }
  }

  // --- ADMIN MANAGEMENT CONTROLS ---
  function initAdminControls() {
    const adminToggleBtn = document.getElementById('nav-admin-toggle');
    const adminSection = document.getElementById('admin-management-section');
    const closeAdminBtn = document.getElementById('btn-close-admin');
    const adminTabs = document.querySelectorAll('.admin-tab-btn');
    const adminPanels = document.querySelectorAll('.admin-subpanel');
    const addGearForm = document.getElementById('admin-add-gear-form');

    if (adminToggleBtn) {
      adminToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAdminSection();
      });
    }

    if (closeAdminBtn) {
      closeAdminBtn.addEventListener('click', () => {
        if (adminSection) adminSection.classList.remove('active');
        window.location.hash = '#home';
      });
    }

    adminTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        adminTabs.forEach(t => t.classList.remove('active'));
        adminPanels.forEach(p => p.style.display = 'none');
        tab.classList.add('active');
        const targetPanel = document.getElementById(tab.dataset.targetPanel);
        if (targetPanel) targetPanel.style.display = 'block';
      });
    });

    if (addGearForm) {
      addGearForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('new-gear-name').value.trim();
        const cat = document.getElementById('new-gear-cat').value;
        const price = parseFloat(document.getElementById('new-gear-price').value);

        if (name && price) {
          const newId = `gear-${Date.now()}`;
          state.gearCatalog.push({
            id: newId,
            name: name,
            category: cat,
            price: price,
            icon: cat === 'microphones' ? '🎙️' : cat === 'consoles' ? '🎛️' : '🎧',
            desc: 'Custom studio equipment added by Arcade Tech Admin.'
          });
          showToast(`Added ${name} to Gear Catalog`, 'success');
          addGearForm.reset();
          renderAdminInventoryTable();
          // Update shop grid as well
          const currentFilter = document.querySelector('.gear-filter-btn.active');
          if (currentFilter) currentFilter.click();
        }
      });
    }

    // Station status buttons
    document.querySelectorAll('.station-status-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const stationId = btn.dataset.stationId;
        const station = state.stations.find(s => s.id === stationId);
        if (station) {
          if (station.status === 'available') station.status = 'in-session';
          else if (station.status === 'in-session') station.status = 'maintenance';
          else station.status = 'available';

          btn.textContent = station.status.toUpperCase();
          btn.className = `btn btn-sm station-status-toggle status-${station.status}`;
          showToast(`Station ${station.name} status updated to ${station.status}`, 'info');
        }
      });
    });

    renderAdminBookingsTable();
    renderAdminInventoryTable();
    updateAdminKPIs();
  }

  function toggleAdminSection() {
    const adminSection = document.getElementById('admin-management-section');
    if (adminSection) {
      adminSection.classList.toggle('active');
      if (adminSection.classList.contains('active')) {
        adminSection.scrollIntoView({ behavior: 'smooth' });
        showToast('Admin Management Control Deck Engaged', 'info');
      }
    }
  }

  function activateAdminSection() {
    const adminSection = document.getElementById('admin-management-section');
    if (adminSection) {
      adminSection.classList.add('active');
      adminSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function renderAdminBookingsTable() {
    const tbody = document.getElementById('admin-bookings-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.bookings.forEach((b, idx) => {
      const tr = document.createElement('tr');
      const badgeClass = b.status === 'Confirmed' ? 'badge-tag' : b.status === 'In Session' ? 'badge-pink' : 'badge-purple';
      tr.innerHTML = `
        <td style="font-family: 'Orbitron'; font-weight: 700; color: var(--neon-cyan);">${b.id}</td>
        <td><strong>${b.customer}</strong></td>
        <td>${b.station}</td>
        <td style="color: var(--text-secondary);">${b.gear}</td>
        <td>${b.date} (${b.duration})</td>
        <td style="font-family: 'Orbitron'; font-weight: 700; color: #ffffff;">$${b.total}</td>
        <td><span class="${badgeClass}">${b.status}</span></td>
        <td>
          <button class="btn btn-sm btn-secondary btn-booking-action" data-index="${idx}" data-action="toggle">
            ${b.status === 'Confirmed' ? 'Check In' : 'Complete'}
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll('.btn-booking-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        const item = state.bookings[index];
        if (item) {
          if (item.status === 'Confirmed') {
            item.status = 'In Session';
            showToast(`${item.customer} checked in to ${item.station}!`, 'success');
          } else {
            item.status = 'Completed';
            showToast(`Session for ${item.customer} marked completed.`, 'info');
          }
          renderAdminBookingsTable();
          updateAdminKPIs();
        }
      });
    });
  }

  function renderAdminInventoryTable() {
    const tbody = document.getElementById('admin-inventory-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.gearCatalog.forEach(gear => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 700; color: #ffffff;">${gear.icon} ${gear.name}</td>
        <td><span class="badge-tag">${gear.category}</span></td>
        <td style="font-family: 'Orbitron'; font-weight: 700; color: var(--neon-cyan);">$${gear.price}/session</td>
        <td><span style="color: var(--neon-green); font-weight: 700;">● Active in Catalog</span></td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="alert('Item calibrated for low-latency streaming.')">Diagnostics</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function updateAdminKPIs() {
    const revenueEl = document.getElementById('kpi-total-revenue');
    const bookingsEl = document.getElementById('kpi-active-bookings');

    const totalRev = state.bookings.reduce((sum, b) => sum + b.total, 24850);
    if (revenueEl) revenueEl.textContent = `$${totalRev.toLocaleString()}`;
    if (bookingsEl) bookingsEl.textContent = `${state.bookings.length} Bookings`;
  }

  // --- GENERAL NAVIGATION & MODAL CLOSES ---
  function initNavAndModals() {
    // Mobile navigation toggle
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (toggleBtn && navMenu) {
      toggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
      });
      // Close on link click
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('open'));
      });
    }

    // Close Confirmation Modal
    const closeConfirmBtn = document.getElementById('btn-close-confirmation-modal');
    const confirmModal = document.getElementById('booking-confirmation-modal');
    if (closeConfirmBtn && confirmModal) {
      closeConfirmBtn.addEventListener('click', () => {
        confirmModal.classList.remove('active');
      });
    }

    // Scroll header styling
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.site-header');
      if (header) {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });

    // Check URL Hash for direct admin or auth opening
    if (window.location.hash === '#admin') {
      activateAdminSection();
    } else if (window.location.hash === '#login' || window.location.hash === '#register') {
      const authModal = document.getElementById('auth-modal-backdrop');
      if (authModal) authModal.classList.add('active');
    }
  }

  // Toast Notification helper
  window.showToast = function(msg, type = 'info') {
    let toast = document.getElementById('app-toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast-notification';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    const icon = type === 'success' ? '⚡' : type === 'warning' ? '⚠️' : '🎙️';
    toast.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span><span>${msg}</span>`;
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 3800);
  };

  // Expose helpers to window for easy inline calls
  window.renderAdminBookingsTable = renderAdminBookingsTable;
  window.updateAdminKPIs = updateAdminKPIs;

  // --- FAQ ACCORDION ENGINE ---
  function initFAQ() {
    document.querySelectorAll('.faq-question-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  // Run modules
  initAudioLab();
  initBookingEngine();
  initGearShop();
  initAuth();
  initAdminControls();
  initNavAndModals();
  initFAQ();
});
