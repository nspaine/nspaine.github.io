import random

def generate_square_wave(cycles, width, y_high, y_low):
    path = []
    cycle_width = width / cycles
    half_cycle = cycle_width / 2
    
    # We need to generate 2 full iterations of the pattern (0-400, 400-800)
    # Actually, simpler: generate 1 iteration (0-400) and then just duplicate it with x offset
    
    one_cycle_path = ""
    current_x = 0
    
    # Start high
    path_d = f"M0,{y_high} "
    
    for i in range(cycles):
        # High segment
        x_mid = current_x + half_cycle
        path_d += f"L{x_mid},{y_high} "
        # Drop down
        path_d += f"L{x_mid},{y_low} "
        # Low segment
        x_end = current_x + cycle_width
        path_d += f"L{x_end},{y_low} "
        # Go up (except last one if we want clean loop? standard square wave goes up at start of next)
        if i < cycles - 1:
             path_d += f"L{x_end},{y_high} "
        else:
            # For the very last point of the 400px block, it ends at y_low.
            # The next block starts at y_high. So we need a riser at 400.
            path_d += f"L{x_end},{y_high} "
            
        current_x = x_end
        
    return path_d

def repeat_path(base_path, width):
    # This is a bit hacky to parse standard string, easier to just generate double loop in loop.
    pass

def generate_full_path(cycles, total_width, y_base, amp=20):
    y_high = y_base - amp
    y_low = y_base + amp
    
    # We want 0-800 pixels. The pattern repeats every 400px.
    # Total cycles in 800px = cycles * 2
    
    total_cycles = cycles * 2
    cycle_width = (total_width / 2) / cycles  # Width for one cycle (e.g. 400/8 = 50)
    
    points = []
    # Start
    points.append((0, y_high))
    
    curr_x = 0
    for i in range(total_cycles):
        # Top part
        next_x = curr_x + cycle_width/2
        points.append((next_x, y_high))
        points.append((next_x, y_low))
        
        # Bottom part
        end_x = curr_x + cycle_width
        points.append((end_x, y_low))
        points.append((end_x, y_high))
        
        curr_x = end_x
        
    # Convert to d string
    d = f"M{points[0][0]},{points[0][1]}"
    for p in points[1:]:
        d += f" L{p[0]:.2f},{p[1]:.2f}"
        
    return d

def generate_random_path(total_width, y_base, amp=20):
    y_high = y_base - amp
    y_low = y_base + amp
    
    # Generate random pattern for 0-400
    # Then repeat it exactly for 400-800
    
    checkpoints = [0]
    curr = 0
    while curr < 400:
        step = random.choice([20, 40, 60, 10])
        if curr + step > 400:
            step = 400 - curr
        curr += step
        checkpoints.append(curr)
        
    # Remove last if it's 400 (handled by loop logic)
    if checkpoints[-1] != 400:
        checkpoints.append(400)
        
    # Assign random High/Low states
    states = []
    for _ in range(len(checkpoints)-1):
        states.append(random.choice([y_high, y_low]))
        
    points = []
    # Start
    points.append((0, states[0]))
    
    # Process 0-400
    for i in range(len(states)):
        x_start = checkpoints[i]
        x_end = checkpoints[i+1]
        y = states[i]
        
        points.append((x_end, y))
        
        if i < len(states) - 1:
            next_y = states[i+1]
            if next_y != y:
                points.append((x_end, next_y))
                
    # Now duplicate for 400-800
    # Last point is (400, last_y). We need to connect to (400, first_y) if different?
    # Or just start generating 400+ offset.
    
    # If last state != first state, we need a vertical line at 400.
    if states[-1] != states[0]:
        points.append((400, states[0]))
        
    # Offset points
    points_second = []
    # We already have the 'start' of the pattern effectively effectively from the connection
    # But let's just copy the logic.
    
    # The first point of the second copy is (400, states[0]).
    # We essentially re-run the point generation with +400 x.
    
    for i in range(len(states)):
        x_start = checkpoints[i] + 400
        x_end = checkpoints[i+1] + 400
        y = states[i]
        
        # We might already be at x_start, y_prev.
        # If we just add the 'horizontal' segment:
        points.append((x_end, y))
        
        if i < len(states) - 1:
            next_y = states[i+1]
            if next_y != y:
                points.append((x_end, next_y))
                
    # Formatting
    d = f"M{points[0][0]},{points[0][1]}"
    for p in points[1:]:
        d += f" L{p[0]:.2f},{p[1]:.2f}"
        
    return d

print("<!-- Lane 1: Clock (8Hz) -->")
print(generate_full_path(16, 800, 30))
print("\n<!-- Lane 2: Random -->")
print(generate_random_path(800, 90))
print("\n<!-- Lane 3: 4Hz -->")
print(generate_full_path(8, 800, 150))
print("\n<!-- Lane 4: 5Hz -->")
print(generate_full_path(10, 800, 210))
