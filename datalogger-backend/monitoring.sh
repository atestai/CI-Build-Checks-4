#!/bin/bash

while true; do
    echo "=== $(date) ==="
    
    # Statistiche Redis
    echo "Redis Stats:"
    redis-cli info | grep -E "used_memory_human|rdb_last_save|connected"
    
    # Conteggio records
    echo -n "Totale records: "
    redis-cli zcard sensor_data
    
    # I/O Disco
    echo "Disk I/O:"
    iostat -x 1 1 | grep sd
    
    # Spazio su disco
    echo "Disk Space:"
    df -h | grep /dev/sd
    
    sleep 300  # Check ogni 5 minuti
done
