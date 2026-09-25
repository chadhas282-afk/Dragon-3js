import React, {
    useEffect,
    useRef,
    useMemo,
    useState,
    } from 'react'

import * as THREE from 'three'

import { useThree, useFrame } from '@react-three/fiber'

import {
    useGLTF,
    useTexture,
    useAnimations,